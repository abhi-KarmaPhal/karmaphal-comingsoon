# PLAN: Confirmation Email System — KrmaPhal

## Overview
When a visitor subscribes via "Notify Me", send a branded confirmation email from `abhi@karmaphal.in` confirming they're on the list.

**Stack:** Nodemailer + Google Workspace SMTP + React Email (template)

---

## Architecture

```
User clicks "Notify Me"
  → Server Action validates email
  → Supabase INSERT (already working ✅)
  → Nodemailer sends confirmation email via Google SMTP
  → Email arrives from abhi@karmaphal.in
  → "You're on the list" branded email
```

---

## Phase 1: Google App Password (Abhi Required)

### Why?
Google Workspace doesn't allow plain password SMTP login. You need an "App Password" — a 16-character code that lets Nodemailer authenticate securely.

### Steps:
1. Go to https://myaccount.google.com/security (logged in as abhi@karmaphal.in)
2. Enable **2-Step Verification** (if not already)
3. Go to **App Passwords** (search "App Passwords" in the security page)
4. Select "Mail" → "Windows Computer" (or "Other")
5. Click **Generate**
6. Copy the 16-character password
7. Share with FRIDAY

---

## Phase 2: Backend Implementation

### Task 2.1: Install Nodemailer
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Task 2.2: Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=abhi@karmaphal.in
SMTP_PASS=<app-password-from-step-1>
```

### Task 2.3: Email Service (`src/lib/email.ts`)
- Nodemailer transporter with Google SMTP
- `sendWelcomeEmail(to: string)` function
- Error handling (don't fail the subscription if email fails)
- Rate aware (Google allows 500 emails/day)

### Task 2.4: Email Template (inline HTML)
- KrmaPhal branding: obsidian background, gold accents
- Logo text: कर्म · PHAL
- "You're on the list" heading
- Philosophy line: "Action is the seed. Result is the fruit. We architect both."
- "We'll notify you when we launch" body
- Footer: © 2026 KrmaPhal · karmaphal.in

### Task 2.5: Integration
- Add email sending to `subscribe.ts` Server Action
- Fire-and-forget (don't block response on email)
- Skip email for duplicate subscribers
- Log errors but don't fail subscription

---

## Phase 3: Security (Security Auditor)

- [ ] App Password stored only in `.env.local`
- [ ] SMTP credentials never sent to client
- [ ] Email sending is fire-and-forget (subscription succeeds even if email fails)
- [ ] No PII leaked in email template
- [ ] Rate limiting prevents email spam (already have 5/hr limit)

---

## Phase 4: Testing

- [ ] Submit email → check inbox for confirmation
- [ ] Check spam folder
- [ ] Verify sender shows as `abhi@karmaphal.in`
- [ ] Verify email renders correctly (desktop + mobile email clients)
- [ ] Submit duplicate → no second email sent
- [ ] Submit with Supabase error → no email sent

---

## Email Template Design

```
┌──────────────────────────────────────────┐
│          [obsidian black background]      │
│                                          │
│              कर्म · PHAL                  │
│      ─────── gold line ───────           │
│                                          │
│         YOU'RE ON THE LIST               │
│                                          │
│   We're crafting something extraordinary.│
│   When we launch, you'll be the first    │
│   to know.                               │
│                                          │
│   "Action is the seed.                   │
│    Result is the fruit.                  │
│    We architect both."                   │
│                                          │
│      ─────── gold line ───────           │
│                                          │
│   © 2026 KrmaPhal · karmaphal.in         │
│                                          │
└──────────────────────────────────────────┘
```

---

## Estimated Effort
- Phase 1 (App Password): 2 min (Abhi)
- Phase 2 (Backend): 15 min (FRIDAY)
- Phase 3 (Security): 5 min
- Phase 4 (Testing): 5 min

**Total: ~25 minutes after App Password received**
