# FlashFusion Customization Service templates

20 templates covering the full customer lifecycle for FF custom orders. Product-type-agnostic — works for custom apparel, custom AI builds, custom automations, custom digital services.

**FF Customization voice defaults:**
- Warm but not casual. "Thanks for reaching out" not "Hey!"
- Concrete timelines. Never "soon" or "shortly" — give a date or range.
- Name the human. Emails come from a named sender, not a brand.
- No exclamation points in anything post-proof. They read as frantic once money's involved.
- Persona-aware. If the customer is tagged with one of the 7 FF personas (`custom.persona-[slug]`), adjust vocabulary and examples accordingly.
- All prices in USD unless the customer has indicated otherwise.

**Coupon integration:** If a persona coupon applies (SHIPPER20, AIBUILDER20, DESIGNERDEV20, OPENSOURCE20, DEVOPS20, FOUNDER20, TECHLEAD20) or a global (FLASH15, SHIPFREE50), surface it in templates 1, 2, and 10 specifically.

## Table of contents

Jump to a template by its number. Each section is self-contained — scan this index and jump directly to the template you need. Templates are ordered roughly by customer lifecycle stage.

| # | Template | Stage | Surface |
|---|---|---|---|
| 1 | Customer intake / RFQ form | Pre-quote | Web form |
| 2 | Initial pricing quote | Quote | Email |
| 3 | Design brief intake (after deposit) | Kickoff | Shared doc / form |
| 4 | Revised quote (after scope change) | Quote revision | Email |
| 5 | Design proof presentation | Proof | Email |
| 6 | Proof approval confirmation | Proof | Email |
| 7 | Revision request intake | Proof | Email / form |
| 8 | Production start notification | Production | Email |
| 9 | Production delay notification | Production | Email |
| 10 | Shipping / delivery confirmation | Fulfillment | Email |
| 11 | Delivery follow-up (1 week post-delivery) | Post-sale | Email |
| 12 | Review / testimonial request | Post-sale | Email |
| 13 | Order amendment form | Post-order | Form |
| 14 | Cancellation request handling | Post-order | Email |
| 15 | Refund processing confirmation | Post-order | Email |
| 16 | Bulk / enterprise inquiry response | Pre-quote | Email |
| 17 | Rush order intake | Pre-quote | Form / email |
| 18 | Reorder shortcut form | Repeat customer | Form |
| 19 | Custom request rejection (out-of-scope) | Pre-quote | Email |
| 20 | Post-fulfillment portfolio case study request | Post-sale | Email |

Cross-template notes at the bottom (second-person default, invoice hygiene, 2-business-day SLA, name-the-human rule, persona coupon surfacing, rejection as brand-setting).

Coupon integration notes (which templates should surface which coupons) are at the top of the file before template 1.

---

## 1. Customer intake / RFQ form

**Use:** Initial inquiry. Customer wants a custom quote.

**Surface:** Web form on FF site, submitted to ticketing system.

**Structure:**
```
FLASHFUSION CUSTOM QUOTE REQUEST

Your name: _________________
Company (if applicable): _________________
Email: _________________
Phone (optional): _________________

What are you looking to customize?
  [ ] Apparel / merch
  [ ] AI build / integration
  [ ] Automation workflow
  [ ] Digital service / dashboard
  [ ] Other: _________________

Tell us about the project (3-6 sentences):
  _________________________________________

Quantity / scope:
  _________________

Target timeline:
  [ ] Rush (under 2 weeks) — rush fee applies
  [ ] Standard (2-6 weeks)
  [ ] Flexible (6+ weeks — best pricing)

Budget range (helps us scope realistically):
  [ ] Under $500
  [ ] $500 – $2,500
  [ ] $2,500 – $10,000
  [ ] $10,000+
  [ ] Not sure — tell me what's possible

How did you hear about us?
  _________________

Which persona best describes you? (optional, helps us tailor)
  [ ] Shipper  [ ] AI Builder  [ ] Designer-Dev  [ ] Open Source Dev
  [ ] DevOps Engineer  [ ] Startup Founder  [ ] Tech Lead
  [ ] None of these — and that's fine

Have a coupon code? _________________

[ Submit ]

By submitting you agree to a 2 business day response time.
We read every submission — no form letters back.
```

**Acceptance:** Budget range is present (not asking "budget?" open-ended — sets realistic expectations up front). Timeline includes a rush option. Persona field is optional.

---

## 2. Initial pricing quote

**Use:** First formal quote after intake. Response within 2 business days.

**Surface:** Email.

**Structure:**
```
Subject: Your custom quote — {{project-name}}

Hi {{first-name}},

Thanks for the detail in your intake — made scoping this much easier.

Here's where I'm landing for {{project-name}}:

  Scope:           {{1-2 sentence scope summary}}
  Quantity:        {{n}}
  Timeline:        {{date range}}
  Base price:      ${{amount}}
  {{optional}} Rush fee:       ${{amount}}
  {{optional}} Persona discount ({{CODE}}): -${{amount}}
  --
  TOTAL:           ${{amount}}

What's included:
  - {{line item}}
  - {{line item}}
  - {{line item}}

What's not included (to keep pricing honest):
  - {{line item}}
  - {{line item}}

Payment: 50% to start, 50% on delivery. Stripe invoice link after
approval.

This quote holds for 14 days.

Two things to confirm:

1. Does the scope match what you had in mind? If not, let me know what's
   off and I'll revise.
2. Does the timeline work?

Reply with a yes or any edits, and I'll send the deposit invoice.

— {{sender-name}}
   FlashFusion Custom
   {{sender-email}}
```

**Acceptance:** "What's not included" section present. Quote expiration date given. Payment structure stated up front. One named sender, not "the team."

---

## 3. Design brief intake (after deposit)

**Use:** After deposit received. Collects the detail needed to actually build.

**Surface:** Shared doc (Notion, Google Doc) or structured form.

**Structure:**
```
DESIGN BRIEF — {{project-name}}
Client: {{name}}
Deposit received: {{date}}
Target delivery: {{date}}

1. THE OUTCOME
What does success look like? Describe the finished thing in 2-3
sentences, as if it already exists.

   {{customer fills}}

2. THE AUDIENCE
Who is this for? Be specific — "tech founders in seed stage" is more
useful than "business owners."

   {{customer fills}}

3. VOICE / TONE / AESTHETIC
3-5 words that capture the feel you want.

   {{customer fills}}

4. MUST-HAVES
Things that absolutely have to be in the final version.
  - {{}}
  - {{}}

5. MUST-NOT-HAVES
Things that would make you reject the delivery, even if everything
else was right.
  - {{}}
  - {{}}

6. REFERENCES
Links to 3-5 examples of things you like (don't have to be in our space).
  - {{}}
  - {{}}

7. ANTI-REFERENCES
Links to 1-2 examples of things you specifically don't want.
  - {{}}

8. APPROVAL FLOW
Who has to sign off before delivery is final?
  - {{}}

9. DELIVERY FORMAT
How do you want to receive the final files / output?
  - {{}}

10. ONE THING I SHOULD KNOW
Anything else about you, your brand, your situation that would change
how I approach this?

   {{customer fills}}

--
Return this within 5 business days so we can hit the target date. If
it goes past 5 days, the timeline shifts accordingly.
```

**Acceptance:** Must-not-haves section present (surfaces deal-breakers early). Anti-references present (more useful than references for avoiding bad fits). Approval flow captured.

---

## 4. Revised quote (after scope change)

**Use:** Customer wants to change scope after the initial quote was accepted.

**Surface:** Email.

**Structure:**
```
Subject: Revised quote — {{project-name}}

Hi {{first-name}},

Following up on your note about {{scope-change}}.

Here's the revised quote:

  Previous scope:   {{summary}}         ${{amount}}
  Changes:
    + {{addition}}                      +${{amount}}
    - {{removal}}                       -${{amount}}
    ~ {{modification}}                   ${{delta}}
  --
  Revised total:                        ${{amount}}

Timeline impact: {{unchanged | extends by N days | requires new target}}

If you're good with this, I'll update the invoice and we'll keep moving.
If you want to talk through the changes first, just say.

— {{sender-name}}
```

**Acceptance:** Shows delta, not just the new total. Timeline impact stated. Doesn't re-quote the whole scope — only the changes.

---

## 5. Design proof presentation

**Use:** Sending first proof to customer for review.

**Surface:** Email with attachment or link.

**Structure:**
```
Subject: Proof ready for review — {{project-name}}

Hi {{first-name}},

First proof is ready. Link / attached below.

  {{link-or-attachment-reference}}

A few notes on how I approached it:

  {{design-decision-1}} — {{1 sentence reasoning}}
  {{design-decision-2}} — {{1 sentence reasoning}}
  {{design-decision-3}} — {{1 sentence reasoning}}

Two things I specifically want your read on:

  1. {{question about a judgment call}}
  2. {{question about a risk area}}

How to respond:

  - If everything's good, reply "approved" and I'll move to production.
  - If you want revisions, send me your notes — either inline in the
    file or in a reply email. I include one round of revisions in the
    quote; a second round is ${{amount}}.

Please turn this around within {{n}} business days so we stay on the
{{date}} delivery. If you need more time, tell me now and I'll rescope.

— {{sender-name}}
```

**Acceptance:** Decisions are explained (reduces "why did you do that"). Two specific questions surfaced so the customer has a frame for reviewing. Revision policy stated. Turnaround deadline given.

---

## 6. Proof approval confirmation

**Use:** Customer has approved the proof. Confirming before moving to production.

**Surface:** Email.

**Structure:**
```
Subject: Approved — moving to production on {{project-name}}

Hi {{first-name}},

Approved on my end. Here's what happens next:

  1. Production starts: {{date}}
  2. Quality check: {{date}}
  3. Delivery target: {{date}}

Heads up on a couple things:

  - Once production starts, changes add time and often cost. If you
    realize something you want changed, reply today.
  - I'll send a production-start confirmation once it's in flight.

Final invoice (remaining 50%) goes out on {{date}} and is due on
delivery.

Thanks — excited to ship this.

— {{sender-name}}
```

**Acceptance:** Three clear dates. Change-lockout explicitly stated. Invoice timing given.

---

## 7. Revision request intake

**Use:** Customer wants changes to the proof. Internal template — capturing their request.

**Surface:** Ticketing system, linked to the project.

**Structure:**
```
REVISION REQUEST — {{project-name}}
Submitted by: {{customer}}
Received: {{date}}
Round: {{1 | 2 | 3+}}

WITHIN SCOPE (covered by quote's included revisions):
  - {{request}}
  - {{request}}

OUT OF SCOPE (requires change order):
  - {{request}} — estimated add ${{amount}}
  - {{request}} — estimated add ${{amount}}

AMBIGUOUS (need to clarify with customer):
  - {{request}} — question: {{what needs clarifying}}

PROPOSED RESPONSE:
  1. Confirm in-scope items — will execute.
  2. Flag out-of-scope items with pricing; wait for approval before
     executing.
  3. Clarify ambiguous items before touching anything.

TIMELINE IMPACT: {{none | +N days | requires rescope}}
```

**Acceptance:** Revisions sorted into in-scope, out-of-scope, ambiguous. Pricing estimated for out-of-scope. Timeline impact called out.

---

## 8. Production start notification

**Use:** Confirming to customer that production has started.

**Surface:** Email (can be short).

**Structure:**
```
Subject: In production — {{project-name}}

Hi {{first-name}},

Quick update: production started {{date}}. Still on track for {{delivery-date}}.

I'll let you know when it's shipped / deployed / ready for pickup.

If anything changes on my end that affects your timeline, you'll hear
from me same-day.

— {{sender-name}}
```

**Acceptance:** Short. Date-specific. Commits to same-day comms if anything changes.

---

## 9. Production delay notification

**Use:** Something's pushed the delivery date. Customer needs to know, early.

**Surface:** Email. Send as soon as you know, not when you have to.

**Structure:**
```
Subject: Heads up — timeline update on {{project-name}}

Hi {{first-name}},

Need to flag a delay on {{project-name}}. Want you to hear it from me
first.

  Original target: {{old-date}}
  New target:      {{new-date}}
  Delta:           {{n}} business days

What happened:

  {{honest, specific cause — no "unforeseen circumstances." name it.}}

What I'm doing about it:

  - {{action}}
  - {{action}}

What this means for you:

  {{specific impact — do they need to reschedule something downstream?
   give them enough info to decide.}}

If this delay creates a real problem for you, tell me now and let's
talk about options. I'd rather rework the approach than push a bad
date past you and hope.

— {{sender-name}}
```

**Acceptance:** Cause named honestly (not "unforeseen"). Offer to rework if the delay creates real downstream problems. Send as soon as known, not when forced to.

---

## 10. Shipping / delivery confirmation

**Use:** The thing has shipped or been delivered. Confirming.

**Surface:** Email.

**Structure:**
```
Subject: Your {{project-name}} is on the way

Hi {{first-name}},

{{thing}} is {{shipped | deployed | delivered | available}} as of
{{date-time}}.

{{IF physical shipment:}}
  Carrier:   {{carrier}}
  Tracking:  {{tracking-number}}
  Track it:  {{tracking-url}}
  ETA:       {{range}}

{{IF digital delivery:}}
  Access:    {{url | credentials sent separately}}
  Docs:      {{link}}
  Loom walkthrough: {{link, if applicable}}

Final invoice for the remaining balance of ${{amount}} is attached.
Due within 7 days of delivery.

Once you've had a chance to look at it / use it, I'll follow up in a
week. If something's not right, don't wait for my follow-up — reply
here and I'll look at it.

Thanks for trusting FlashFusion with this.

— {{sender-name}}
```

**Acceptance:** Tracking / access info clear. Follow-up schedule stated. Invites early escalation if something's wrong.

---

## 11. Delivery follow-up (1 week post-delivery)

**Use:** Check in after delivery. Catch issues before they become reviews.

**Surface:** Email.

**Structure:**
```
Subject: Quick check-in — {{project-name}}

Hi {{first-name}},

It's been {{a week}} since {{project-name}} went out. Hoping everything's
landing well on your end.

Three quick things:

  1. Anything not working the way you expected? Even small — I'd rather
     hear it now than find it in a review later.

  2. If it IS landing well — would you be open to a short quote I can
     feature on the site? No pressure, no template — just a sentence
     or two in your voice.

  3. Any adjacent work you're planning in the next 90 days? Not a
     sales pitch — just thinking about capacity and wanted to flag.

Either way — thanks for the project. Good one to work on.

— {{sender-name}}
```

**Acceptance:** Problem-check question first (not testimonial-ask first). Testimonial request is optional, un-templated. Future-work question framed as capacity planning, not sales.

---

## 12. Review / testimonial request

**Use:** Customer indicated they're happy. Asking for a public review or testimonial.

**Surface:** Email.

**Structure:**
```
Subject: One small ask

Hi {{first-name}},

Glad {{project-name}} is working for you.

If you have 2 minutes, would you be open to leaving a quick review or
sharing a thought I can use as a testimonial?

Three options, pick whichever is easiest:

  Option A — Google review: {{link}}
  Option B — Reply to this email with a sentence or two I can quote
             on the site (with your name + company if you're good with
             that, or anonymized if you'd prefer)
  Option C — A short recorded video (30-60 sec, phone camera is fine)
             — {{upload link}}

No worries if the timing is bad or it's not your thing. Either way,
thanks for the project.

— {{sender-name}}
```

**Acceptance:** Three option tiers (low, medium, high effort). Anonymization offered. Genuine opt-out ("no worries").

---

## 13. Order amendment form

**Use:** Customer wants to change an order post-approval but pre-production.

**Surface:** Email or web form.

**Structure:**
```
Subject: Confirming your change to {{project-name}}

Hi {{first-name}},

Got your note on wanting to change {{what}}. Want to make sure I've got
it right before I update anything.

What's changing:

  Was:  {{original}}
  Now:  {{requested}}

Impact:

  Price:    ${{delta}} ({{addition | credit}})
  Timeline: {{unchanged | +N days}}
  Other:    {{anything else affected}}

If that's correct, reply "confirmed" and I'll make the change and send
an updated invoice.

If I've misread any of it, tell me what I got wrong.

— {{sender-name}}
```

**Acceptance:** Plays back the change before executing. Impact stated. Asks for explicit confirmation before acting.

---

## 14. Cancellation request handling

**Use:** Customer wants to cancel. Handle cleanly.

**Surface:** Email.

**Structure:**
```
Subject: Cancellation request — {{project-name}}

Hi {{first-name}},

Got your request to cancel {{project-name}}. No questions asked — I
respect the decision.

Here's where things land based on our agreement:

  Stage:               {{pre-deposit | pre-proof | pre-production | in-production | delivered}}
  Deposit:             ${{amount}} {{refundable | non-refundable per terms}}
  Work completed:      {{description}}
  Refund amount:       ${{amount}}
  Refund timeline:     {{n}} business days to the original payment
                       method

If there's anything from the work-to-date you want (files, drafts, notes
from the intake), I'm happy to send those over. Yours to keep.

If there's anything I could have done differently, I'd genuinely like
to hear it — but only if you feel like sharing. Zero pressure.

Best of luck with {{project or next step if mentioned}}.

— {{sender-name}}
```

**Acceptance:** No guilt-trip. No attempted save. Work-to-date offered to keep. Feedback requested softly. Refund specifics given.

---

## 15. Refund processing confirmation

**Use:** Refund has been initiated. Confirming.

**Surface:** Email.

**Structure:**
```
Subject: Refund processed — {{project-name}}

Hi {{first-name}},

Refund of ${{amount}} processed to {{payment-method-last-4}} on
{{date}}.

Your bank should show it within {{n}} business days. If it hasn't
landed by {{specific-date}}, reply to this email and I'll get
confirmation from Stripe.

Reference: {{refund-id}}

Thanks for trying us.

— {{sender-name}}
```

**Acceptance:** Specific date for follow-up if refund doesn't land. Reference ID given. Short.

---

## 16. Bulk / enterprise inquiry response

**Use:** Someone submitted an intake for a large volume or enterprise-scale engagement.

**Surface:** Email. Different track from individual RFQ.

**Structure:**
```
Subject: Scoping call for {{company}} — {{project-name}}

Hi {{first-name}},

Thanks for the intake. Based on the scope ({{scope summary}}), this is
a fit for our enterprise track rather than the standard RFQ path.

Differences:

  - We start with a 30-minute scoping call before any quote.
  - Pricing is structured tier / retainer rather than per-project.
  - Delivery is phased against your timeline, not ours.
  - There's typically an MSA to handle before first invoice.

Proposed next step — 30-minute scoping call. Here are three windows
this week:

  {{day, date, time, timezone}}
  {{day, date, time, timezone}}
  {{day, date, time, timezone}}

If none of those work, reply with a window that does.

Before the call, it'd help if you could send over:

  - Any existing creative brief / RFP
  - Approval chain on your end (who signs off)
  - Budget envelope (even a rough range)

— {{sender-name}}
   FlashFusion
```

**Acceptance:** Sets expectation that enterprise track is different. Scoping call offered. Pre-call ask is reasonable (3 things, not 10).

---

## 17. Rush order intake

**Use:** Customer needs something urgently. Under 2 weeks.

**Surface:** Web form or email.

**Structure:**
```
FLASHFUSION RUSH ORDER

What you need:
  _________________

When you need it (specific date):
  _________________

Why the rush (helps us prioritize — all info confidential):
  _________________

Quantity / scope:
  _________________

Rush fee acknowledgment:

  Rush orders carry a {{percentage}}% fee on top of the base quote. This
  covers team overtime, expedited sourcing, and the opportunity cost of
  other work we shift.

  [ ] I understand and accept the rush fee structure.

Budget range:
  [ ] Under $1,500
  [ ] $1,500 – $5,000
  [ ] $5,000 – $15,000
  [ ] $15,000+

I'll respond within 4 business hours whether we can take it on. If we
can, you'll get a quote within 24 hours.

If we can't take it on, I'll say so quickly and — where I can —
recommend someone who can.

Your name: _________________
Email: _________________
Phone (for faster coordination): _________________
```

**Acceptance:** Rush fee disclosed up front. Response SLA stated (4 hours). Customer given expectation that a "no" is possible and will be fast.

---

## 18. Reorder shortcut form

**Use:** Returning customer wants to order something similar to a previous order.

**Surface:** Web form, pre-filled if logged in.

**Structure:**
```
REORDER — SIMPLIFIED

Pulling from your previous order: {{order-id}} on {{date}}

What was in that order:
  {{auto-populated summary}}

Reorder this exact setup?
  [ ] Yes, same as before
  [ ] Same but with changes (describe below)
  [ ] New project — take me to the full intake form

{{IF "same but with changes":}}
What's different this time?
  _________________

Quantity this time: _________________
Timeline: {{same as before | rush | flexible}}
Shipping address: {{same | new}}

Apply a coupon? _________________

[ Submit reorder ]

Returning customer: most reorders skip the proof stage unless you've
requested changes. If you want to see a proof anyway, note it above.
```

**Acceptance:** Pre-populates from history. Three clear paths. Proof-skip default for unchanged reorders, with opt-in override.

---

## 19. Custom request rejection (out-of-scope)

**Use:** Someone inquired about something FF Customization doesn't do. Closing respectfully.

**Surface:** Email.

**Structure:**
```
Subject: Re: your request — {{project-topic}}

Hi {{first-name}},

Thanks for thinking of us for {{project-topic}}.

Being honest with you: this one isn't a good fit for what we do well.

Specifically: {{concrete reason — "we don't handle manufacturing at this
scale," "this needs an attorney's sign-off that we can't provide,"
"this is outside our technical stack," etc}}

Two options that might actually work for you:

  1. {{specific recommendation — name a service or type of provider}}
  2. {{specific recommendation}}

If I've misread what you're after and you think there's still a fit,
feel free to reply and correct me. But I'd rather say no fast than
take a project we can't do well.

Best of luck with it.

— {{sender-name}}
```

**Acceptance:** Honest reason given (not "capacity"). Two specific alternative recommendations. Door left open for misread scope. No fake-warmth.

---

## 20. Post-fulfillment portfolio case study request

**Use:** Asking permission to feature a completed project in a case study on the FF site.

**Surface:** Email, sent 2-4 weeks post-delivery.

**Structure:**
```
Subject: Can I feature {{project-name}} as a case study?

Hi {{first-name}},

Checking in {{n weeks}} post-delivery — hoping {{project-name}} is
still landing well on your end.

I'd like to feature the work as a case study on the FlashFusion site.
Here's what that would look like:

  What I'd include:
    - Project outcome / metrics (if you're willing)
    - Before/after or proof-of-work visuals
    - A short description of the challenge and solution
    - Your company name and / or your name — your call

  What I WOULDN'T include:
    - Anything confidential
    - Anything you explicitly flag as off-limits
    - Your name if you'd rather it be anonymized

  Approval before publishing:
    - Full draft sent to you for review
    - Nothing publishes without your written yes
    - You can revoke the feature any time after — I take it down.

If you're open to this, reply and let me know:

  1. Any specifics you want in or out
  2. Whether to use your company name / your name / anonymized
  3. Any metrics or outcomes you're willing to share publicly

If it's a no, no worries at all — doesn't affect anything between us.

— {{sender-name}}
```

**Acceptance:** Explicit what-I-wouldn't-include. Takedown-anytime promise. Opt-out framed as zero-consequence. Approval-before-publishing commitment.

---

## Cross-template notes

**The second-person default.** Every template addresses the customer directly ("you"). No "the client" in anything customer-facing.

**Invoice hygiene.** Stripe invoice references appear in templates 2, 4, 6, 10, 13, 15. Keep amounts, dates, and reference IDs consistent across touchpoints. Mismatches trigger support tickets.

**The 2-business-day SLA.** Response time is stated on the intake form (template 1) and should be honored in templates 2, 5, 9, 11, 12, 16, 19. If you can't hold the SLA consistently, revise the intake form.

**Name-the-human.** Every customer-facing email here is signed by a named sender. No "the team" or "FlashFusion Support." Accountability compounds.

**Persona coupon surfacing.** Templates 1 and 2 surface coupons explicitly. Don't surface them after proof approval — feels like desperation and can trigger chargeback disputes if applied retroactively.

**Rejection and cancellation set the brand.** Templates 14 and 19 are where most brands get sloppy. They're also where memory compounds — the customer who got a clean rejection is more likely to refer you than one who got ghosted.
