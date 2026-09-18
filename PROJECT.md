# Remote Hirring — Project Context

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
- Prisma 7 + PostgreSQL (Supabase, ap-southeast-1 pooler)
- Auth: custom cookie (`userId`), roles in `Roles` table
- Emails: Resend (sandbox — domain verification pending)
- File storage: Supabase Storage (CVs)
- Payments: Stripe (planned — not integrated yet)

## Environment
- Windows 11, PowerShell 5.x (no `&&` — use separate commands)
- Prisma `migrate dev` fails on network → use Supabase SQL Editor + `npx prisma generate`
- Set `CHECKPOINT_DISABLE=1` to speed up prisma generate
- Git: `core.pager cat` (no pager), `core.autocrlf true` (Windows)

## Roles
- `candidate` — applies, edits own profile, view apps/interviews
- `recruiter` — CLIENT (pays, requests hires)
- `admin` / `super_admin` — platform owner

## Key models
- `Application` (status: pending → shortlisted → hire_pending → awaiting_payment → hired / rejected / hire_cancelled)
- `Interview` (status: pending → scheduled → completion_requested → completed / cancelled)
- `Invoice` (created on hire approval, 15-day dueAt)
- `Subscription` (annual $5,000, renews $4,000)
- `Notification` (in-app bell)
- `CandidateProfile` (candidate master record)
- `ContactMessage` (contact form submissions)

## Hire flow
1. Candidate applies
2. Client requests interview
3. Admin schedules interview
4. Interview happens → admin marks completed (or client requests → admin confirms)
5. Client clicks "Request Hire" → picks plan → status = `hire_pending`
6. Admin approves in `/dashboard/hire-approvals` → creates Invoice → status = `awaiting_payment`
7. (TODO) Client pays via Stripe → webhook → status = `hired`

## Folder layout
- `app/` — pages + API routes
- `app/dashboard/*` — shared admin + client dashboard
- `app/account/*` — candidate account + profile edit
- `app/api/*` — API routes
- `components/*` — shared components
- `prisma/schema.prisma`

## Completed
- Mobile responsive shell + sidebar + topbar
- Footer + legal pages (privacy/terms/cookies)
- Candidate dashboard + profile edit
- Phase 1: Invoice/Subscription/Notification schema
- Phase 2: Client hire request + plan picker modal
- Phase 3.0: Interview completion + hire gating
- Phase 3.1: Admin hire approvals page + invoice creation
- Candidate profile card in ApplicationsView
- Toast notifications (sonner) — replaced all 56 alerts
- Custom 404/error pages
- Pricing page (homepage + /pricing) — Annual $5,000
- Dashboard real KPI numbers
- Long application form simplified
- Contact form → DB + admin page

## In progress (tonight)
- Security hardening (Phase 1 → 3)

## Not started
- Phase 4: Stripe checkout
- Phase 5: Stripe webhook → mark hired
- Phase 6: 15-day deadline warnings
- Phase 7: Cron auto-cancel
- Annual subscription purchase
- Bell real notifications (currently hardcoded)
- Search bar
- Loading states / skeletons
- SEO meta tags
- Rate limiting on public APIs
- Email template makeover
- Domain + Vercel deploy
- Resend domain verification

## Security TODO (CRITICAL)
1. [ ] bcrypt password hashing (currently base64 — insecure)
2. [ ] Signed/HMAC session cookies (currently raw userId — spoofable)
3. [ ] Rate limiting on public APIs
4. [ ] Private CV bucket (signed URLs)
5. [ ] Server-side file type validation
6. [x] Rotate leaked DB password + Resend key
7. [ ] Supabase RLS policies
8. [ ] 2FA for admin
9. [ ] Audit log for admin actions

## Contact
- Real admin email: hr@remotehirring.com
- Domain: remotehirring.com (Resend verification pending)

## How to continue
1. Paste this file
2. Paste current file being edited
3. Say "continue"