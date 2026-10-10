# Multi-LLM Orchestration Patterns

Route tasks intelligently across Claude, GPT, and Gemini based on cost, speed, and capability.

## Table of Contents

1. [Model Comparison](#model-comparison)
2. [Routing Strategies](#routing-strategies)
3. [Implementation Patterns](#implementation-patterns)
4. [Cost Optimization](#cost-optimization)

## Model Comparison

| Model | Best For | Speed | Cost | Context |
|-------|----------|-------|------|---------|
| Claude Sonnet 4.5 | Complex reasoning, code generation, analysis | Medium | $$$ | 200K |
| Claude Haiku 3.5 | Fast responses, simple tasks, high volume | Fast | $ | 200K |
| GPT-4o | General purpose, fast structured output | Fast | $$ | 128K |
| GPT-4o-mini | Simple tasks, high volume | Very Fast | $ | 128K |
| Gemini 1.5 Pro | Long context (1M+ tokens), video/audio | Slow | $$$ | 2M |
| Gemini 1.5 Flash | Fast, cost-effective at scale | Very Fast | $ | 1M |

## Routing Strategies

### Strategy 1: Task-Based Routing

**Route by task complexity:**
```python
def route_task(task_type: str, content: str) -> str:
    """Route to best model based on task type."""
    
    routing_map = {
        "code_review": "claude-sonnet-4-20250514",
        "code_generation": "claude-sonnet-4-20250514",
        "simple_qa": "gpt-4o-mini",
        "structured_extraction": "gpt-4o",
        "long_document_analysis": "gemini-1.5-pro",
        "translation": "gpt-4o-mini",
        "summarization": "claude-haiku-3-5-20241022",
    }
    
    return routing_map.get(task_type, "claude-sonnet-4-20250514")
```

### Strategy 2: Token-Based Routing

**Route by context length:**
```python
import tiktoken

def route_by_tokens(content: str, task: str) -> str:
    """Route based on token count."""
    encoder = tiktoken.get_encoding("cl100k_base")
    token_count = len(encoder.encode(content))
    
    if token_count > 100000:
        return "gemini-1.5-pro"  # 2M context
    elif token_count > 50000:
        return "gemini-1.5-flash"  # 1M context, cheaper
    elif task == "code":
        return "claude-sonnet-4-20250514"  # Best for code
    else:
        return "gpt-4o-mini"  # Fast & cheap
```

### Strategy 3: Cost-Optimized Cascade

**Try cheap models first, escalate if needed:**
```python
async def cascade_query(prompt: str, max_cost: float = 0.01):
    """Try cheap models first, escalate on failure."""
    
    cascade = [
        ("gpt-4o-mini", 0.001),
        ("claude-haiku-3-5-20241022", 0.003),
        ("gpt-4o", 0.005),
        ("claude-sonnet-4-20250514", 0.01),
    ]
    
    for model, cost in cascade:
        if cost > max_cost:
            break
        
        try:
            response = await call_llm(model, prompt)
            if is_valid_response(response):
                return response
        except Exception:
            continue  # Try next model
    
    raise Exception("No model succeeded within cost budget")
```

### Strategy 4: Parallel Fan-Out

**Run multiple models, pick best response:**
```python
import asyncio

async def parallel_consensus(prompt: str, models: list[str]):
    """Query multiple models and pick consensus."""
    
    tasks = [call_llm(model, prompt) for model in models]
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Simple voting (extend with similarity scoring)
    from collections import Counter
    valid_responses = [r for r in responses if not isinstance(r, Exception)]
    
    if not valid_responses:
        raise Exception("All models failed")
    
    # Return most common response
    return Counter(valid_responses).most_common(1)[0][0]
```

## Implementation Patterns

### Pattern 1: Unified Client

**Single interface for all LLMs:**
```python
from anthropic import Anthropic
from openai import OpenAI
import google.generativeai as genai

class UnifiedLLMClient:
    def __init__(self):
        self.anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    
    async def call(self, model: str, prompt: str, **kwargs) -> str:
        """Unified call method."""
        
        if model.startswith("claude"):
            return await self._call_claude(model, prompt, **kwargs)
        elif model.startswith("gpt"):
            return await self._call_openai(model, prompt, **kwargs)
        elif model.startswith("gemini"):
            return await self._call_gemini(model, prompt, **kwargs)
        else:
            raise ValueError(f"Unknown model: {model}")
    
    async def _call_claude(self, model: str, prompt: str, **kwargs):
        message = self.anthropic.messages.create(
            model=model,
            max_tokens=kwargs.get("max_tokens", 4096),
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text
    
    async def _call_openai(self, model: str, prompt: str, **kwargs):
        response = self.openai.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=kwargs.get("max_tokens", 4096)
        )
        return response.choices[0].message.content
    
    async def _call_gemini(self, model: str, prompt: str, **kwargs):
        model_obj = genai.GenerativeModel(model)
        response = model_obj.generate_content(prompt)
        return response.text
```

### Pattern 2: Router Middleware

**Express-style routing middleware:**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
client = UnifiedLLMClient()

class CompletionRequest(BaseModel):
    prompt: str
    task_type: str = "general"
    max_cost: float = 0.01

@app.post("/completions")
async def complete(req: CompletionRequest):
    # Route based on task type
    model = route_task(req.task_type, req.prompt)
    
    try:
        response = await client.call(model, req.prompt)
        return {
            "response": response,
            "model_used": model,
            "cost_estimate": estimate_cost(model, req.prompt, response)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Cost Optimization

### Token Usage Tracking

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class UsageLog:
    model: str
    input_tokens: int
    output_tokens: int
    cost: float
    timestamp: datetime

class CostTracker:
    PRICING = {
        "claude-sonnet-4-20250514": {"input": 3.00, "output": 15.00},  # per 1M tokens
        "gpt-4o": {"input": 2.50, "output": 10.00},
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
    }
    
    def __init__(self):
        self.logs: list[UsageLog] = []
    
    def log_usage(self, model: str, input_tokens: int, output_tokens: int):
        pricing = self.PRICING.get(model, {"input": 0, "output": 0})
        cost = (
            (input_tokens / 1_000_000) * pricing["input"] +
            (output_tokens / 1_000_000) * pricing["output"]
        )
        
        self.logs.append(UsageLog(
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost=cost,
            timestamp=datetime.now()
        ))
    
    def total_cost(self) -> float:
        return sum(log.cost for log in self.logs)
    
    def cost_by_model(self) -> dict:
        from collections import defaultdict
        costs = defaultdict(float)
        for log in self.logs:
            costs[log.model] += log.cost
        return dict(costs)
```

### Smart Caching

**Cache responses to avoid duplicate calls:**
```python
import hashlib
import json
from functools import lru_cache

class LLMCache:
    def __init__(self):
        self.cache = {}
    
    def _hash_request(self, model: str, prompt: str, **kwargs) -> str:
        """Generate cache key."""
        data = {"model": model, "prompt": prompt, **kwargs}
        return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
    
    async def get_or_call(self, model: str, prompt: str, **kwargs):
        """Return cached response or make new call."""
        key = self._hash_request(model, prompt, **kwargs)
        
        if key in self.cache:
            print(f"💰 Cache hit! Saved ${self.cache[key]['cost']:.4f}")
            return self.cache[key]["response"]
        
        response = await client.call(model, prompt, **kwargs)
        cost = estimate_cost(model, prompt, response)
        
        self.cache[key] = {"response": response, "cost": cost}
        return response
```

## Deployment Example

**Vercel Edge Function with routing:**
```typescript
// api/complete.ts
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

const routeTask = (taskType: string): string => {
  const routes: Record<string, string> = {
    'code_review': 'claude-sonnet-4-20250514',
    'simple_qa': 'gpt-4o-mini',
    'long_analysis': 'gemini-1.5-pro',
  };
  return routes[taskType] || 'claude-sonnet-4-20250514';
};

export default async function handler(req: NextRequest) {
  const { prompt, taskType = 'general' } = await req.json();
  const model = routeTask(taskType);
  
  // Route to appropriate client
  let response;
  if (model.startsWith('claude')) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    response = msg.content[0].text;
  } else if (model.startsWith('gpt')) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    response = completion.choices[0].message.content;
  }
  
  return new Response(JSON.stringify({ response, model }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Best Practices

1. **Default to cheaper models** - Escalate only when needed
2. **Cache aggressively** - Same prompt = same response
3. **Track costs** - Monitor spend per model/task type
4. **Validate responses** - Don't trust first output blindly
5. **Set budgets** - Per-user or per-day spending limits
6. **Test routing logic** - Ensure tasks go to optimal models
