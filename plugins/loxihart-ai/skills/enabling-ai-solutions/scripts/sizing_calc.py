#!/usr/bin/env python3
"""
AI Solution Sizing Calculator
Outputs tier recommendation, monthly cost estimate, and component list.

Usage:
  Interactive:  python sizing_calc.py
  CLI args:     python sizing_calc.py --dau 1000 --sessions 3 --rps 5 --peak 4 \
                    --tokens-in 500 --tokens-out 300 --compliance none
  JSON output:  python sizing_calc.py --json [+ any flags above]

Python 3.10+ required.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, asdict
from typing import Literal


# ---------------------------------------------------------------------------
# Pricing (April 2026 — update when provider rate cards change)
# ---------------------------------------------------------------------------

LLM_PRICING: dict[str, dict[str, float]] = {
    "claude-opus-4.6":    {"input_per_m": 5.00,  "output_per_m": 25.00},
    "claude-sonnet-4.6":  {"input_per_m": 3.00,  "output_per_m": 15.00},
    "claude-haiku-4.5":   {"input_per_m": 0.25,  "output_per_m":  1.25},
    "gpt-5.4":            {"input_per_m": 2.50,  "output_per_m": 10.00},
    "gpt-5.4-nano":       {"input_per_m": 0.08,  "output_per_m":  0.30},
    "gemini-2.5-pro":     {"input_per_m": 1.25,  "output_per_m":  5.00},
    "gemini-2.0-flash":   {"input_per_m": 0.10,  "output_per_m":  0.40},
    "deepseek-v3.2":      {"input_per_m": 0.14,  "output_per_m":  0.28},
}

INFRA_COSTS: dict[str, dict[str, float]] = {
    "small": {
        "compute":      20.0,   # Vercel Pro
        "database":     25.0,   # Supabase Pro
        "vector_db":     0.0,   # pgvector included
        "cache":         5.0,   # Upstash Redis pay-per-req
        "observability": 0.0,   # PostHog + Sentry free tiers
    },
    "medium": {
        "compute":      20.0,   # Vercel Pro or Cloudflare Workers
        "database":     25.0,   # Supabase Pro
        "vector_db":    70.0,   # Pinecone Starter
        "cache":        20.0,   # Upstash Redis
        "observability":50.0,   # PostHog + Sentry paid tiers
    },
    "large": {
        "compute":     400.0,   # AWS ECS/Fargate 2-4 containers
        "database":    350.0,   # RDS db.r6g.large or Supabase Team
        "vector_db":   500.0,   # Pinecone Standard
        "cache":       150.0,   # ElastiCache Redis
        "observability":150.0,  # PostHog + Sentry + Datadog partial
    },
}

TIER_THRESHOLDS = {
    "small":  (0, 5_000),
    "medium": (5_000, 50_000),
    "large":  (50_000, float("inf")),
}


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class SizingInputs:
    dau: int                            # Daily Active Users
    sessions_per_user: float            # Sessions per user per day
    requests_per_session: float         # AI requests per session
    peak_multiplier: float              # Peak hour vs. average multiplier
    avg_tokens_in: int                  # Average input tokens per request
    avg_tokens_out: int                 # Average output tokens per request
    compliance: str                     # none | gdpr | hipaa | soc2 | pci
    routing_enabled: bool = True        # Use budget/mid/frontier routing?
    budget_tier_pct: float = 0.60       # % of requests routed to budget model
    mid_tier_pct: float = 0.35          # % routed to mid-tier
    # frontier_pct = 1 - budget_pct - mid_tier_pct


@dataclass
class SizingResult:
    daily_requests: int
    peak_qps: float
    tier: Literal["small", "medium", "large"]
    monthly_llm_cost_low: float
    monthly_llm_cost_high: float
    monthly_infra_cost: float
    monthly_total_low: float
    monthly_total_high: float
    recommended_llm_primary: str
    recommended_llm_budget: str | None
    compliance_notes: list[str]
    component_stack: dict[str, str]
    warnings: list[str]


# ---------------------------------------------------------------------------
# Core calculations
# ---------------------------------------------------------------------------

def calculate_daily_requests(inputs: SizingInputs) -> int:
    return int(inputs.dau * inputs.sessions_per_user * inputs.requests_per_session)


def calculate_peak_qps(daily_requests: int, peak_multiplier: float) -> float:
    avg_qps = daily_requests / 86_400
    return round(avg_qps * peak_multiplier, 3)


def determine_tier(daily_requests: int) -> Literal["small", "medium", "large"]:
    for tier, (low, high) in TIER_THRESHOLDS.items():
        if low <= daily_requests < high:
            return tier  # type: ignore[return-value]
    return "large"


def calculate_llm_cost(
    inputs: SizingInputs,
    daily_requests: int,
    primary_model: str,
    budget_model: str | None,
) -> tuple[float, float]:
    """Returns (monthly_low, monthly_high) cost range."""

    def cost_for_model(model: str, requests_per_day: int) -> float:
        pricing = LLM_PRICING[model]
        daily_input  = (requests_per_day * inputs.avg_tokens_in  / 1_000_000) * pricing["input_per_m"]
        daily_output = (requests_per_day * inputs.avg_tokens_out / 1_000_000) * pricing["output_per_m"]
        return (daily_input + daily_output) * 30

    if not inputs.routing_enabled or budget_model is None:
        # Single model, no routing
        base = cost_for_model(primary_model, daily_requests)
        return base * 0.8, base * 1.3  # ±20–30% variance band

    # Routing: budget | mid | frontier split
    frontier_pct = max(0.0, 1.0 - inputs.budget_tier_pct - inputs.mid_tier_pct)
    frontier_model = "claude-opus-4.6" if "claude" in primary_model else "gpt-5.4"

    budget_req   = int(daily_requests * inputs.budget_tier_pct)
    mid_req      = int(daily_requests * inputs.mid_tier_pct)
    frontier_req = int(daily_requests * frontier_pct)

    total = (
        cost_for_model(budget_model, budget_req)
        + cost_for_model(primary_model, mid_req)
        + cost_for_model(frontier_model, frontier_req)
    )
    return total * 0.85, total * 1.25


def select_models(tier: str, inputs: SizingInputs) -> tuple[str, str | None]:
    """Returns (primary_model, budget_model_or_None)."""
    if tier == "small":
        return "claude-sonnet-4.6", None if not inputs.routing_enabled else "claude-haiku-4.5"
    elif tier == "medium":
        return "claude-sonnet-4.6", "claude-haiku-4.5"
    else:
        return "claude-sonnet-4.6", "claude-haiku-4.5"


def build_component_stack(tier: str, inputs: SizingInputs) -> dict[str, str]:
    stacks = {
        "small": {
            "compute":    "Vercel Pro ($20/month)",
            "database":   "Supabase Pro ($25/month)",
            "vector_db":  "pgvector on Supabase (included)",
            "cache":      "Upstash Redis (pay-per-req, ~$5/month)",
            "auth":       "Supabase Auth or Clerk",
            "observability": "PostHog free + Sentry free",
        },
        "medium": {
            "compute":    "Vercel Pro or Cloudflare Workers ($20/month)",
            "database":   "Supabase Pro ($25/month)",
            "vector_db":  "Pinecone Starter or pgvector ($0–70/month)",
            "cache":      "Upstash Redis ($10–30/month)",
            "auth":       "Supabase Auth, Clerk, or Auth0",
            "observability": "PostHog ($0–50) + Sentry ($0–26)",
        },
        "large": {
            "compute":    "AWS ECS/Fargate 2–4 containers ($300–600/month)",
            "database":   "RDS db.r6g.large or Supabase Team ($200–599/month)",
            "vector_db":  "Pinecone Standard ($500/month)",
            "cache":      "ElastiCache Redis ($100–200/month)",
            "auth":       "Auth0 or Azure AD for enterprise SSO",
            "observability": "PostHog + Sentry + Datadog ($150+/month)",
        },
    }
    stack = stacks[tier].copy()

    # Compliance-driven overrides
    c = inputs.compliance.lower()
    if c == "hipaa":
        stack["compute"]  = "AWS ECS/Fargate with BAA"
        stack["database"] = "RDS PostgreSQL with RDS Encryption (BAA)"
        stack["llm"]      = "Azure OpenAI (BAA) or Anthropic (BAA) — self-hosted if strict"
    elif c == "gdpr":
        stack["llm"] = "Azure OpenAI EU regions or self-hosted (data residency)"
    elif c == "pci":
        stack["compute"] = "Isolated CDE on AWS; tokenization via Stripe (stay out of scope)"

    return stack


def compliance_notes(compliance: str) -> list[str]:
    notes_map = {
        "none": [],
        "gdpr": [
            "Confirm DPA signed with LLM provider (Anthropic and OpenAI both offer DPAs)",
            "Avoid sending identifiable EU user data to hosted LLM APIs without DPA",
            "Azure OpenAI has EU data residency options for strict GDPR deployments",
            "Implement data export and deletion API endpoints before launch",
        ],
        "hipaa": [
            "BAA required: cloud provider (AWS/Azure/GCP all offer BAA), LLM provider, analytics",
            "PHI de-identification pipeline required before any LLM API call",
            "Audit logging: 6-year retention on immutable storage (WORM)",
            "TLS 1.3 in transit; AES-256 at rest; mTLS for internal services",
            "MFA enforced for all admin access; session timeout 15min",
        ],
        "soc2": [
            "Access logs retained minimum 1 year (CloudTrail or equivalent)",
            "Incident response plan documented and tested quarterly",
            "Automated test coverage > 80% required for [COMPLIANCE FRAMEWORK] evidence",
            "Annual [COMPLIANCE FRAMEWORK] audit with accredited auditor",
        ],
        "pci": [
            "Use Stripe/Braintree tokenization — keep your system out of PCI scope entirely",
            "If in-scope: firewall allowlist only (443 + 22), CDE isolation, quarterly ASV scans",
            "Unique IDs for CDE access; no shared accounts; MFA + VPN + IP allowlist for admin",
        ],
    }
    return notes_map.get(compliance.lower(), [f"Unknown compliance framework: {compliance}"])


def build_warnings(inputs: SizingInputs, daily_requests: int, tier: str) -> list[str]:
    warnings = []
    if daily_requests > 1_000 and not inputs.routing_enabled:
        warnings.append(
            f"Routing disabled but {daily_requests:,} req/day: enabling routing "
            "could reduce LLM cost 50–70%. Set --routing to enable."
        )
    if tier == "large" and inputs.compliance in ("none", ""):
        warnings.append(
            "Large tier with no compliance declared: verify with client — "
            "enterprise deployments often require [COMPLIANCE FRAMEWORK]."
        )
    if inputs.avg_tokens_in > 2_000:
        warnings.append(
            f"High average input tokens ({inputs.avg_tokens_in:,}): "
            "consider prompt compression or caching — token cost scales linearly."
        )
    if inputs.peak_multiplier > 10:
        warnings.append(
            f"Peak multiplier {inputs.peak_multiplier}x is high (>10x): "
            "verify this is realistic. Consider serverless to handle spikes cost-effectively."
        )
    return warnings


# ---------------------------------------------------------------------------
# Main calculation
# ---------------------------------------------------------------------------

def run_sizing(inputs: SizingInputs) -> SizingResult:
    daily_requests = calculate_daily_requests(inputs)
    peak_qps = calculate_peak_qps(daily_requests, inputs.peak_multiplier)
    tier = determine_tier(daily_requests)
    primary_model, budget_model = select_models(tier, inputs)

    llm_low, llm_high = calculate_llm_cost(inputs, daily_requests, primary_model, budget_model)
    infra = sum(INFRA_COSTS[tier].values())

    return SizingResult(
        daily_requests=daily_requests,
        peak_qps=peak_qps,
        tier=tier,
        monthly_llm_cost_low=round(llm_low, 2),
        monthly_llm_cost_high=round(llm_high, 2),
        monthly_infra_cost=round(infra, 2),
        monthly_total_low=round(infra + llm_low, 2),
        monthly_total_high=round(infra + llm_high, 2),
        recommended_llm_primary=primary_model,
        recommended_llm_budget=budget_model,
        compliance_notes=compliance_notes(inputs.compliance),
        component_stack=build_component_stack(tier, inputs),
        warnings=build_warnings(inputs, daily_requests, tier),
    )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def interactive_mode() -> SizingInputs:
    print("\n=== AI Solution Sizing Calculator ===\n")
    print("Press Enter to accept defaults shown in [brackets].\n")

    def prompt(label: str, default: str, cast: type) -> object:
        raw = input(f"  {label} [{default}]: ").strip()
        return cast(raw) if raw else cast(default)

    return SizingInputs(
        dau=int(prompt("Daily Active Users", "500", str)),
        sessions_per_user=float(prompt("Sessions per user per day", "3", str)),
        requests_per_session=float(prompt("AI requests per session", "5", str)),
        peak_multiplier=float(prompt("Peak hour multiplier (3–5 B2B, 8–12 B2C)", "4", str)),
        avg_tokens_in=int(prompt("Avg prompt tokens per request", "500", str)),
        avg_tokens_out=int(prompt("Avg completion tokens per request", "300", str)),
        compliance=prompt("Compliance (none/gdpr/hipaa/soc2/pci)", "none", str).lower(),  # type: ignore[arg-type]
        routing_enabled=prompt("Enable LLM routing? (y/n)", "y", str).lower() in ("y", "yes", "true", "1"),  # type: ignore[arg-type]
    )


def print_result(result: SizingResult, inputs: SizingInputs) -> None:
    print("\n" + "=" * 60)
    print("  SIZING RESULT")
    print("=" * 60)
    print(f"\n  Daily Requests:    {result.daily_requests:>10,}")
    print(f"  Peak QPS:          {result.peak_qps:>10.2f}")
    print(f"  Sizing Tier:       {result.tier.upper():>10}")
    print(f"\n  Monthly LLM Cost:  ${result.monthly_llm_cost_low:>8,.2f} – ${result.monthly_llm_cost_high:,.2f}")
    print(f"  Monthly Infra:     ${result.monthly_infra_cost:>8,.2f}")
    print(f"  TOTAL ESTIMATE:    ${result.monthly_total_low:>8,.2f} – ${result.monthly_total_high:,.2f}")
    print(f"\n  Primary LLM:       {result.recommended_llm_primary}")
    if result.recommended_llm_budget:
        print(f"  Budget LLM:        {result.recommended_llm_budget} ({int(inputs.budget_tier_pct*100)}% of traffic)")

    print("\n  Component Stack:")
    for k, v in result.component_stack.items():
        print(f"    {k:<16} {v}")

    if result.compliance_notes:
        print(f"\n  Compliance Notes ({inputs.compliance.upper()}):")
        for note in result.compliance_notes:
            print(f"    ⚠  {note}")

    if result.warnings:
        print("\n  Warnings:")
        for w in result.warnings:
            print(f"    !  {w}")

    print("\n" + "=" * 60)
    print("  Prices sourced from tldl.io/resources/llm-api-pricing-2026")
    print("  Verify current pricing before committing to a cost model.")
    print("=" * 60 + "\n")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="AI Solution Sizing Calculator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--dau",         type=int,   help="Daily Active Users")
    p.add_argument("--sessions",    type=float, help="Sessions per user per day")
    p.add_argument("--rps",         type=float, help="AI requests per session")
    p.add_argument("--peak",        type=float, help="Peak hour multiplier")
    p.add_argument("--tokens-in",   type=int,   help="Avg input tokens per request")
    p.add_argument("--tokens-out",  type=int,   help="Avg output tokens per request")
    p.add_argument("--compliance",  type=str,   default="none",
                   choices=["none", "gdpr", "hipaa", "soc2", "pci"])
    p.add_argument("--no-routing",  action="store_true", help="Disable LLM routing model")
    p.add_argument("--budget-pct",  type=float, default=0.60,
                   help="Fraction of traffic on budget model tier (default 0.60)")
    p.add_argument("--mid-pct",     type=float, default=0.35,
                   help="Fraction of traffic on mid tier (default 0.35)")
    p.add_argument("--json",        action="store_true", help="Output as JSON")
    return p.parse_args()


def main() -> None:
    args = parse_args()

    # Determine mode: CLI args provided → use them; otherwise interactive
    cli_mode = any([args.dau, args.sessions, args.rps, args.peak, args.tokens_in, args.tokens_out])

    if cli_mode:
        inputs = SizingInputs(
            dau=args.dau or 500,
            sessions_per_user=args.sessions or 3.0,
            requests_per_session=args.rps or 5.0,
            peak_multiplier=args.peak or 4.0,
            avg_tokens_in=args.tokens_in or 500,
            avg_tokens_out=args.tokens_out or 300,
            compliance=args.compliance,
            routing_enabled=not args.no_routing,
            budget_tier_pct=args.budget_pct,
            mid_tier_pct=args.mid_pct,
        )
    else:
        inputs = interactive_mode()

    result = run_sizing(inputs)

    if args.json:
        output = {
            "inputs": asdict(inputs),
            "result": asdict(result),
        }
        print(json.dumps(output, indent=2))
    else:
        print_result(result, inputs)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nAborted.")
        sys.exit(0)
    except ValueError as e:
        print(f"\nInput error: {e}", file=sys.stderr)
        sys.exit(1)
