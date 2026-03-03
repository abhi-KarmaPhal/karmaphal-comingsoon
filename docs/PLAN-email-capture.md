# PLAN: Email Capture & Notification System — KrmaPhal Coming Soon

## Overview
Implement a complete "Notify Me" email capture system with database storage, confirmation emails, and launch-day notification capability.

**Stack:** Next.js Server Actions + Supabase (PostgreSQL) + Resend (Email API)

---

## Phase 0: Account Setup (Abhi Required)

### Task 0.1: Supabase Project
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project: "krmaphal"
- [ ] Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Settings → API
- [ ] Share keys with FRIDAY

### Task 0.2: Resend Account
- [ ] Create Resend account at [resend.com](https://resend.com)
- [ ] Add domain `karmaphal.in` → get DNS records
- [ ] Add DNS records in Cloudflare (FRIDAY can guide)
- [ ] Copy `RESEND_API_KEY` from Resend dashboard
- [ ] Share key with FRIDAY

---

## Phase 1: Database Schema (Database Architect)

### Task 1.1: Create `subscribers` Table in Supabase
```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'coming-soon',
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT
);

-- Index for fast lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_created ON subscribers(created_at DESC);

-- Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert (server-side only)
CREATE POLICY "Service role insert" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Only service role can read
CREATE POLICY "Service role select" ON subscribers
  FOR SELECT USING (true);
```

### Task 1.2: Verification
- [ ] Table created in Supabase dashboard
- [ ] RLS enabled
- [ ] Test INSERT via Supabase SQL editor

**Agent:** Database Architect
**Skill:** database-design

---

## Phase 2: Backend Implementation (Backend Specialist)

### Task 2.1: Environment Variables
```env
SUPABASE_URL=<from Abhi>
SUPABASE_SERVICE_KEY=<from Abhi>
RESEND_API_KEY=<from Abhi>
```
- [ ] Create `.env.local` (gitignored)
- [ ] Install dependencies: `@supabase/supabase-js`, `resend`

### Task 2.2: Supabase Client
- [ ] Create `src/lib/supabase.ts` — server-side Supabase client (service role key)
- [ ] Type-safe with generated types

### Task 2.3: Resend Client
- [ ] Create `src/lib/resend.ts` — Resend client
- [ ] Create `src/emails/welcome.tsx` — React Email confirmation template
  - KrmaPhal branding (gold + obsidian)
  - "You're on the list" messaging
  - Brand philosophy line

### Task 2.4: Server Action
- [ ] Create `src/app/actions/subscribe.ts`
- [ ] Input validation (email format, length, disposable domain check)
- [ ] Rate limiting (max 5 submissions per IP per hour)
- [ ] Honeypot field check (bot protection)
- [ ] Duplicate check (if already subscribed → friendly message)
- [ ] Supabase INSERT
- [ ] Resend confirmation email
- [ ] Return typed response

**Agent:** Backend Specialist
**Skills:** api-patterns, nodejs-best-practices, clean-code

---

## Phase 3: Frontend Updates (Frontend Specialist)

### Task 3.1: Form Enhancement
- [ ] Add hidden honeypot field (bot trap)
- [ ] Add loading state (gold spinner)
- [ ] Add success state (gold checkmark animation + "You're on the list")
- [ ] Add error state (red message, retry option)
- [ ] Add "already subscribed" state (friendly, not an error)
- [ ] Disable submit during loading
- [ ] Client-side email validation before server call

### Task 3.2: Success Animation
- [ ] Gold checkmark SVG draws itself (stroke animation)
- [ ] "You're on the list" text fades in
- [ ] Matches luxury divine aesthetic
- [ ] Auto-resets after 5 seconds (in case they want to submit another)

**Agent:** Frontend Specialist
**Skills:** frontend-design, tailwind-patterns, nextjs-react-expert

---

## Phase 4: Security Hardening (Security Auditor)

### Task 4.1: Security Checklist
- [ ] Server-side validation (never trust client)
- [ ] Rate limiting implemented
- [ ] Honeypot field active
- [ ] No API keys exposed to client (service key server-only)
- [ ] CORS headers correct
- [ ] SQL injection protected (Supabase SDK handles this)
- [ ] XSS protected (React handles this)
- [ ] Email sanitization (trim, lowercase)
- [ ] Disposable email domain blocking (optional)
- [ ] RLS enabled on Supabase table

**Agent:** Security Auditor
**Skills:** vulnerability-scanner, api-patterns

---

## Phase 5: Testing (QA Engineer)

### Task 5.1: Manual Testing
- [ ] Submit valid email → success
- [ ] Submit invalid email → error message
- [ ] Submit duplicate email → "already subscribed" message
- [ ] Submit empty form → validation error
- [ ] Submit with honeypot filled → silent reject
- [ ] Check Supabase dashboard → email appears
- [ ] Check inbox → confirmation email received
- [ ] Mobile form submission works

### Task 5.2: Edge Cases
- [ ] Very long email address
- [ ] Email with special characters
- [ ] Rapid multiple submissions (rate limit)
- [ ] Network error handling

**Agent:** Test Engineer, QA Automation Engineer

---

## Phase 6: Launch Day Preparation (DevOps)

### Task 6.1: Launch Email Template
- [ ] Create launch announcement email template
- [ ] KrmaPhal branding
- [ ] "We're Live" messaging
- [ ] CTA to website

### Task 6.2: Batch Send Script
- [ ] Script to fetch all confirmed subscribers
- [ ] Batch send via Resend (100/batch, rate limited)
- [ ] Mark each as `notified_at`
- [ ] Error handling for failed sends

**Agent:** Backend Specialist, DevOps Engineer

---

## Component Map

| File | Purpose | Agent |
|------|---------|-------|
| `src/lib/supabase.ts` | Supabase server client | Backend |
| `src/lib/resend.ts` | Resend email client | Backend |
| `src/app/actions/subscribe.ts` | Server Action | Backend |
| `src/emails/welcome.tsx` | Confirmation email template | Frontend |
| `src/components/MonolithHero.tsx` | Form UI updates | Frontend |
| `.env.local` | API keys (gitignored) | DevOps |

---

## Execution Order
1. **Phase 0** → Abhi creates accounts, shares keys
2. **Phase 1** → Database schema (5 min)
3. **Phase 2** → Backend logic (20 min)
4. **Phase 3** → Frontend updates (15 min)
5. **Phase 4** → Security review (10 min)
6. **Phase 5** → Testing (10 min)
7. **Phase 6** → Launch prep (deferred until launch day)

## Estimated Total: ~1 hour (after keys received)
