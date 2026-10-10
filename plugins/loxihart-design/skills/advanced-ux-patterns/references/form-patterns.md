# Form Design Best Practices

## Layout

### Single-Column Always
```
✅ Single column: eyes scan down predictably, no skipping around
❌ Multi-column: users miss fields, unclear reading order
Exception: paired fields (first name / last name, city / state / zip)
```

### Label Positioning
```
✅ Label above input (always visible, works at any zoom level)
❌ Placeholder-only labels (disappear on focus, accessibility fail)
❌ Left-aligned labels (scanning requires horizontal eye movement)

If space is tight: floating labels (label moves above on focus/fill)
— but test with screen readers before shipping
```

### Field Width
```
Match input width to expected content length:
- Full width: name, email, address, message/textarea
- Medium (50%): phone, zip code, city
- Short (25%): state, country code, quantities
- Narrow (10%): day, month, year (when separate)
```

---

## Input Types

### Use Native HTML Inputs
```html
<!-- Email: triggers @ keyboard on mobile, browser validates -->
<input type="email" autocomplete="email">

<!-- Phone: triggers numeric keyboard on mobile -->
<input type="tel" autocomplete="tel">

<!-- Number: use for quantities only, not for codes/IDs -->
<input type="number" min="1" max="99">

<!-- Date: native picker, avoid for date of birth (use 3 selects instead) -->
<input type="date">

<!-- Password: always pair with show/hide toggle -->
<input type="password" autocomplete="current-password">

<!-- Search: X to clear, submits on Enter -->
<input type="search">
```

### Autocomplete Attributes (Critical for 1.3.5 WCAG)
```html
<!-- Personal info -->
<input autocomplete="name">
<input autocomplete="given-name">
<input autocomplete="family-name">
<input autocomplete="email">
<input autocomplete="tel">

<!-- Address -->
<input autocomplete="street-address">
<input autocomplete="address-level2"> <!-- city -->
<input autocomplete="address-level1"> <!-- state -->
<input autocomplete="postal-code">
<input autocomplete="country">

<!-- Payment -->
<input autocomplete="cc-number">
<input autocomplete="cc-exp">
<input autocomplete="cc-csc">

<!-- Login -->
<input autocomplete="username">
<input autocomplete="current-password">
<input autocomplete="new-password">
```

---

## Validation

### When to Validate
```
On blur (leaving field): check individual field
On submit: validate all fields, focus first error
On keypress: only for real-time requirements (password strength, username availability)
NOT on every keystroke for most fields (too aggressive)
```

### Error Messages
```
✅ GOOD: specific, actionable
"Email address must include @. Try user@example.com"
"Password must be at least 8 characters (currently 6)"
"Phone number must be 10 digits — don't include dashes"

❌ BAD: vague, blaming
"Invalid input"
"Error"
"This field is required"

Structure: What's wrong + How to fix it
```

### Visual Treatment
```
Error state:
- Red border on input (not just text color — colorblind users)
- Error icon (!) inside or left of input
- Error message below input (not tooltip — tooltips disappear)
- aria-invalid="true" on input
- aria-describedby="[error-id]" on input

Success state:
- Green checkmark (for validated fields: email, username, password)
- Only show on fields that benefit (don't green-check every field)
```

### ARIA Pattern for Errors
```html
<div class="field">
  <label for="email">Email address</label>
  <input 
    type="email" 
    id="email" 
    aria-invalid="true"
    aria-describedby="email-error"
    value="notanemail"
  >
  <p id="email-error" role="alert">
    Enter a valid email address (example@domain.com)
  </p>
</div>
```

### Submit Error Summary
```html
<!-- When form submits with errors, show summary at top -->
<div role="alert" aria-live="assertive">
  <h2>Please fix 3 errors before submitting:</h2>
  <ul>
    <li><a href="#email">Email: enter a valid address</a></li>
    <li><a href="#phone">Phone: required field</a></li>
    <li><a href="#card">Card number: invalid format</a></li>
  </ul>
</div>
```

---

## Interaction Patterns

### Required vs Optional
```
✅ Mark optional fields (rare): "Optional" label suffix
✅ Don't use asterisk alone (explain in legend: "* required")
✅ Prefer: remove optional fields entirely if possible
❌ Mark every required field with * (visual clutter when most fields are required)
```

### Inline Formatting Hints
```
- Show format hints before the user types, not after error
- Place hints between label and input or below
- Remove hint on fill (don't duplicate with success state)

Examples:
Date: "MM/DD/YYYY" shown below empty field
Phone: "(555) 555-5555" shown below empty field
Password: "At least 8 characters, one number" shown below empty field
```

### Password Fields
```
Always include:
1. Show/hide toggle (eye icon button, aria-label="Show password")
2. Strength meter for new passwords (`@zxcvbn-ts/core` — maintained fork of the original zxcvbn)
3. Minimum requirements visible (don't hide until they fail)

For confirmation field:
- Validate on blur of confirm field (not on every keystroke)
- Error: "Passwords don't match"
```

### Smart Defaults
```
✅ Pre-select country based on IP geolocation
✅ Default quantity to 1
✅ Remember last used payment method (autofill)
✅ Pre-fill address from billing address for shipping
✅ Today's date for date fields where today is most likely
```

### Dependent Fields
```
When Field B depends on Field A:
- Show Field B only when Field A is complete
- Or: disable Field B until Field A is valid
- Update B's options when A changes (refetch or filter)
- Clear B when A changes (stale selection is worse than empty)
```

---

## Multi-Step Forms

### Progress Indicators
```
✅ Step indicator: "Step 2 of 4" + step names
✅ Progress bar: visual % complete
Both if space allows
Position: above form, below page header
```

### Step Navigation
```
Forward: only allow when current step validates
Back: always allow (don't clear progress)
Save: auto-save draft per step if long form (>5 min expected)
Skip: only for truly optional sections (profile photo, preferences)
```

### Button Labels
```
Intermediate steps: "Continue" (not "Submit")
Final step: "Submit [specific action]" ("Place Order", "Create Account", "Send Request")
Back button: "Back" or "Previous Step"
```

---

## Special Cases

### Search Forms
```
- Input width: at least 300px (avoid truncated queries)
- Label: visually hidden is OK if placeholder + search icon make intent clear
- Submit: explicit button OR Enter key (both)
- Auto-suggest: show after 2–3 chars, max 8 suggestions
- "No results" message with suggestion ("Try fewer words?")
```

### Filters / Faceted Search
```
- Apply filters immediately (no "Apply" button needed if fast)
- Show active filters as chips/tags with X to remove
- Count of results updates live
- "Clear all filters" option when filters are active
- Collapsible filter groups for mobile
```

### File Upload
```html
<label for="upload" class="upload-button">
  Choose file
  <input type="file" id="upload" accept=".pdf,.docx,.jpg,.png" aria-label="Upload document">
</label>
<p class="hint">PDF, Word, or image — max 10MB</p>
```
```
After selection:
- Show filename + size
- Show preview if image
- Allow remove/replace
- Show upload progress
- Error: "File too large (15MB). Max is 10MB."
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Placeholder as label | Label disappears, inaccessible | Label above input, placeholder for format hint only |
| Disabled submit button | User doesn't know why | Enable submit, show inline errors on attempt |
| CAPTCHA | High friction, accessibility barrier | Use honeypot or invisible reCAPTCHA v3 |
| Reset/Clear button | Accidental data loss | Remove it. Add undo if needed. |
| Asking for same info twice | Frustrating | Pre-fill from previous step, or don't ask twice |
| Vague error messages | User doesn't know how to fix | Specific + actionable error copy |
| Auto-format while typing | Cursor position jumps, frustrating | Format on blur only |
| Forcing format (phone dashes) | Annoying, error-prone | Accept any format, normalize on submit |
| Revealing password requirements only on failure | User needs to know upfront | Show requirements before they type |
