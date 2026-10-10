# Stack Options

Deployment options. Loaded when the task is about infrastructure, cost, or model
choice. The architecture is stack-agnostic; AWS is the reference implementation.

## Reference deployment (Loxihart MSP)

- **Compute:** AWS Lambda (event-driven on the ITSM webhook).
- **Generation:** AWS Bedrock. `[FILL: exact Bedrock model used in the reference deployment]`
- **Latency:** ~90 seconds ticket-resolved → Draft article.
- **Cost:** ~$1–5 / month at the reference ticket volume. Cost scales with volume × tokens-per-article.

## Alternatives

| Layer | Reference (AWS) | Alternative A | Alternative B |
|---|---|---|---|
| Compute | Lambda | Azure Functions | Self-hosted worker / n8n |
| LLM | Bedrock | Azure OpenAI | Anthropic API direct |
| Trigger | ITSM webhook | Polling the ITSM API | Queue (SQS/Service Bus) |
| Secrets | `[FILL: secrets store — env vars / Bitwarden / cloud secret mgr]` | — | — |

Selection drivers: where the client's data already lives, compliance/residency
constraints, and existing cloud commitments. Match the client's stack rather
than imposing AWS.

## Cost estimation

Rough monthly cost ≈ (article-worthy tickets/month) × (tokens per article) ×
(model $/token) + compute invocations. Pull article-worthy volume from intake
and the model rate from current provider pricing.

`[FILL: current model $/token for the chosen provider — do not guess; look up current pricing]`

## Security notes

- Route all credentials through a secrets manager / env vars — never embed keys in code or config.
- PII redaction (Phase 0) runs before any text reaches the model.
- `[FILL: client data residency / compliance regime — e.g., [COMPLIANCE FRAMEWORK], HIPAA — and any constraint it places on model choice or region]`
