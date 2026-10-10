# RLS Patterns — Full Reference

Project context: flashnframe-app (etctmappdhpjuwptdbeb). Every table gets RLS
enabled before it gets data — no exceptions, including "internal" tables.

```sql
ALTER TABLE public.things ENABLE ROW LEVEL SECURITY;
```

## Core patterns

**Public read, no writes (anon + authenticated):**
```sql
CREATE POLICY "public read" ON public.things
  FOR SELECT TO anon, authenticated USING (true);
```

**Owner-only CRUD:**
```sql
CREATE POLICY "owner select" ON public.things
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY "owner insert" ON public.things
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "owner update" ON public.things
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "owner delete" ON public.things
  FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
```
`(SELECT auth.uid())` (initPlan form) evaluates once per query instead of
per row — meaningfully faster on large tables.

**Tenant isolation (org membership):**
```sql
CREATE POLICY "org members" ON public.projects
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM public.org_members
                    WHERE user_id = (SELECT auth.uid())));
```
The membership subquery belongs in a `SECURITY DEFINER` function if
`org_members` itself has RLS — otherwise the policy recurses.

## The four failure modes that actually happen

1. **UPDATE/INSERT without `WITH CHECK`** — users can move rows *into* states
   they couldn't read. USING gates what you see; WITH CHECK gates what you write.
2. **Policy granted to the wrong role** — a policy `TO public` includes anon.
   Name roles explicitly, always.
3. **New table, RLS forgotten** — enablement is step one of table creation,
   not a hardening pass later.
4. **service_role in client code** — bypasses every policy. Server-side env
   var only; if it ever appears in a bundle, rotate immediately (hard rule).

## Testing policies

```sql
-- Impersonate a user in SQL editor:
SELECT set_config('request.jwt.claims',
  '{"sub":"<user-uuid>","role":"authenticated"}', true);
SET LOCAL role authenticated;
SELECT * FROM public.things;  -- should return only that user's rows
```
Test the deny path too: the correct result for a foreign row is zero rows,
not an error. An RLS suite that only tests allows tests nothing.
