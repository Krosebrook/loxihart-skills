# Refactoring Patterns Reference

## Pattern: Rename Symbol Across Codebase

```bash
# Step 1: Find all occurrences
grep -rn "oldName" src/ --include="*.ts"

# Step 2: Replace in each file using Edit tool with replace_all=true
# Step 3: Verify no remaining references
grep -rn "oldName" src/ --include="*.ts"

# Step 4: Run tests
npm test
```

## Pattern: Extract Function

When a block of code appears in 3+ locations:
1. Identify the common logic
2. Create a named function with typed parameters
3. Replace all occurrences with function call
4. Run tests after each replacement (not after all)

## Pattern: Replace Deprecated API

```bash
# Step 1: Find all usages of deprecated API
grep -rn "deprecatedMethod" src/ --include="*.ts" --include="*.tsx"

# Step 2: For each file, replace with new API
# Use Edit tool — old_string: deprecated pattern, new_string: replacement

# Step 3: Update imports if the new API is in a different module
# Step 4: Run type checker
npx tsc --noEmit

# Step 5: Run tests
npm test
```

## Pattern: Update Import Paths (Module Restructure)

When moving files or renaming modules:
1. Move the file first
2. Update the file's own imports (relative paths change)
3. Find all files that import from the old path
4. Update each import to the new path
5. Run type checker to catch any missed references

## When to Use Batch Mode (10+ files)

For large-scale refactoring across many files, switch to code-execution
mode. Generate a script that:
1. Reads all target files
2. Applies the transformation programmatically
3. Writes the results
4. Reports what changed

This saves approximately 90% of tokens vs. individual Edit calls.
