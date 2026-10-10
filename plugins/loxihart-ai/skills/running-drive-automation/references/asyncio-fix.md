# Asyncio Throughput Fix — Chain 2 Fan-Out

## Problem

Sequential per-file crew execution makes batch time linear in file count.
The council's per-file evaluations are independent — ideal fan-out shape.

## Pattern

CrewAI's `kickoff()` is synchronous, so parallelism comes from a thread
executor under asyncio, bounded by a semaphore:

```python
import asyncio

MAX_CONCURRENT = 5  # start here; raise only after watching API rate limits

async def evaluate_file(sem: asyncio.Semaphore, crew, file_meta: dict) -> dict:
    async with sem:
        loop = asyncio.get_running_loop()
        try:
            result = await loop.run_in_executor(
                None, lambda: crew.kickoff(inputs=file_meta)
            )
            return {"file": file_meta["id"], "ok": True, "memo": result}
        except Exception as e:              # noqa: BLE001 — batch must survive
            return {"file": file_meta["id"], "ok": False, "error": repr(e)}

async def run_batch(crew, files: list[dict]) -> list[dict]:
    sem = asyncio.Semaphore(MAX_CONCURRENT)
    return await asyncio.gather(*(evaluate_file(sem, crew, f) for f in files))
```

## Rules

- **Bound the concurrency.** Unbounded `gather` over LLM-backed crews trips
  provider rate limits and produces silent partial batches.
- **Per-file try/except.** One failed file must not kill the batch; failures
  land in the result list and get reported, then written to the audit trail.
- **Write memos after gather,** in one pass — cleaner Supabase error handling
  than mid-flight writes.
- Verify the win empirically: time a 10-file batch sequential vs parallel
  before claiming a speedup number anywhere.
