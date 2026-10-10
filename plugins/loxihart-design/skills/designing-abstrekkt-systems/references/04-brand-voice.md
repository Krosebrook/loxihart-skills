# Reference 04 — Brand Voice System

Deterministic language rules. All microcopy must derive from these patterns.
No poetic interpretation. No filler. No hedging.

---

## Core Principles

| Principle | Rule | Enforcement |
|---|---|---|
| Declarative | Past or present tense. State facts. | Never "helps you", "enables you to" |
| Tactical | Name the specific action and outcome | Never "get started", "explore" |
| Precise | Specific numbers, durations, counts | Never "a few", "quickly", "soon" |
| Earned | Competence shown through specificity | Never "best-in-class", "powerful" |
| Minimal | Cut every word that doesn't carry meaning | Never "please", "unfortunately" |

---

## CTA Hierarchy

| Level | Pattern | Examples |
|---|---|---|
| **Primary** | Verb + object | "Start Audit", "Download Report", "Create Campaign" |
| **Secondary** | Verb + neutral | "Save Draft", "Schedule", "Review Changes" |
| **Tertiary** | Verb only | "Cancel", "Close", "Skip" |
| **Destructive** | Verb + consequence | "Delete Audit", "Remove User", "Clear All Data" |

**Rule:** CTAs are 2–4 words maximum. No punctuation. No ellipsis.

---

## State Message Templates

### Success States
Pattern: Past tense + specific outcome. Optional: next action offered.

```
"Audit complete. 23 gaps identified."
"Saved."
"Submitted. Confirmation sent to [email]."
"Deleted."
"Campaign published."
```

**Never:**
```
"Great! Your request was successfully submitted! ✓"
"Woohoo! You're all set!"
```

### Error States
Pattern: Present tense + cause + action.

```
"Email format invalid. Use name@domain.com."
"Connection failed. Check network and retry."
"File too large. Maximum 10MB."
"Password too short. 8+ characters required."
"Upload failed. Accepted formats: PDF, PNG, JPG."
```

**Never:**
```
"Oops! Something went wrong. Please try again later."
"We're having trouble with that right now."
```

### Loading States
Pattern: Status + noun. No adjectives.

```
"Loading audit results..."
"Uploading..."
"Processing..."
"Saving changes..."
```

**Never:**
```
"Hang tight! We're working our magic..."
"Almost there!"
```

### Empty States
Pattern: Directive + specific action (if available).

```
"No campaigns yet. Create one to begin."
"No results for 'red barn'. Try a broader term."
"No audit history. Start an audit to see results here."
"No team members. Invite someone to get started."
```

**Never:**
```
"It looks like you don't have any campaigns yet!"
"Wow, it's empty here! Add your first campaign."
```

### Confirmation Dialogs (Destructive Actions)
Pattern: Action + consequence. Yes/No options specific to action.

```
Title: "Delete this audit?"
Body: "This removes all findings and reports. Cannot be undone."
Confirm: "Delete Audit"
Cancel: "Keep Audit"
```

**Never:**
```
Title: "Are you sure?"
Body: "This action cannot be undone."
Confirm: "Yes"
Cancel: "No"
```

### Onboarding
Pattern: Directive → specific first step.

```
"Upload your client data. We'll profile your current state."
"Connect your first integration to begin."
"Run the diagnostic. It takes 3 minutes."
```

**Never:**
```
"Welcome! We're excited to have you here. Let's get you set up."
"You're just a few steps away from unlocking the power of AI."
```

---

## Error Message Code Reference

```typescript
const errorMessages = {
  required: (field: string) => `${field} is required.`,
  email: 'Email format invalid. Use name@domain.com.',
  password: 'Password must be 8+ characters with uppercase, lowercase, and number.',
  passwordMatch: 'Passwords do not match.',
  minLength: (field: string, min: number) => `${field} must be ${min}+ characters.`,
  maxLength: (field: string, max: number) => `${field} must be ${max} characters or fewer.`,
  pattern: (field: string) => `${field} format invalid.`,
  fileTooLarge: (max: string) => `File too large. Maximum ${max}.`,
  fileType: (types: string) => `Invalid file type. Accepted: ${types}.`,
  network: 'Connection failed. Check internet and retry.',
  server: 'Server error. Try again in a moment.',
  unauthorized: 'Authentication failed. Check credentials.',
  notFound: 'Not found. Verify and retry.',
  rateLimited: 'Too many requests. Wait a moment and retry.',
  forbidden: 'Access denied. Contact your administrator.',
} as const;
```

---

## Abstrekkt/FlashFusion Specific Copy

### Service Descriptions
```
FlashFusion: "B2B AI enablement. One domain expert trained per engagement."
Load-Bearing: "AI tools, tested under load. No hype, no sales pitch."
Abstrekkt: "Holding company for FlashFusion and adjacent products."
```

### Engagement Process
```
Step 1: "Audit — current state mapped."
Step 2: "Training — one domain expert becomes your AI champion."
Step 3: "Exit — you operate independently."
```

### Avoid in All External Copy
- "AI-powered" (meaningless, everyone uses it)
- "Cutting-edge" / "state-of-the-art"
- "Leverage" as a verb
- "Seamlessly"
- "Transformative"
- "Unlock the power of"
- "Take your [X] to the next level"
- "Game-changing"
