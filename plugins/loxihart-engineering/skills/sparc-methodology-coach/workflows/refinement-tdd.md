<process>

## Phase R: Refinement — TDD (35% of effort)

Write the test before the code it tests. Always.

### TDD Cycle (Red → Green → Refactor):
1. **Red** — write a failing test that describes the behavior you want
2. **Green** — write the minimum code to make the test pass
3. **Refactor** — improve code quality without changing behavior (tests still pass)
4. Repeat for the next requirement

### Test Priority Order:
1. Happy path for P0 requirements
2. Error cases for P0 requirements
3. Happy path for P1 requirements
4. Edge cases — boundary values, empty inputs, concurrent access
5. Performance assertions — only if NFRs specify targets

### Coverage Requirements:
- Every acceptance criterion from Phase S → at least one test
- Every error path from Phase P → a test
- Every integration point from Phase A → a contract test
- Auth and permission logic specifically — not just happy path

### What NOT to test:
- Framework internals (don't test that React renders a div)
- Trivial getters/setters
- Third-party library behavior
- Implementation details that change during refactoring

### Tests that test the mock (anti-pattern):
```typescript
// BAD — this tests nothing real
vi.mock('./auth');
(auth.verify as Mock).mockReturnValue(true);
expect(auth.verify()).toBe(true); // You're just testing your mock
```

### Spiking exception:
Building a PoC for an unfamiliar API? Spike code first, then write tests before calling the feature done. State you're spiking.

### TDD pattern example:
```typescript
// RED — failing test first
it('locks account after 5 failed attempts', async () => {
  const user = await createTestUser();
  for (let i = 0; i < 5; i++) {
    await POST('/auth/login', { email: user.email, password: 'wrong' });
  }
  const res = await POST('/auth/login', { email: user.email, password: 'wrong' });
  expect(res.status).toBe(429);
  expect(res.body.error).toMatch(/locked/i);
});

// GREEN — minimum code to pass
// REFACTOR — clean up without breaking the test
```

</process>
