# Remote Hirring — Project Context

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Prisma + Supabase Postgres (use SQL Editor for migrations, `prisma generate` after)
- Auth: cookie-based (`userId`)
- Resend (emails, pending domain), Stripe (payments, planned)

## Roles
- `candidate` — applies, edits own profile
- `recruiter` — CLIENT (pays, requests hire)
- `admin`/`super_admin` — owner

## Key flow
pending → shortlisted → interview scheduled → completed → hire_pending → awaiting_payment → hired

## Done
- Mobile responsive, footer, legal pages
- Candidate dashboard + profile edit
- Phase 1: Invoice/Subscription/Notification schema
- Phase 2: Client hire request + plan picker
- Phase 3.0: Interview completion + hire gating
- Candidate profile card in ApplicationsView

## Next up
- Phase 3.1: Admin approval page (`/dashboard/hire-approvals`)
- Phase 4: Stripe checkout
- Phase 5: Webhook → mark hired
- Phase 6: 15-day deadline warnings
- Phase 7: Cron auto-cancel
- Annual subscription
- Replace alerts with sonner toasts
- Bell with real data
- Pricing page fixes
- Resend domain setup

## How to continue
Paste this file + current file you're editing + say "continue".