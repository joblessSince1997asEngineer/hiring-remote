# Remote Hirring - Project Context

## Live
Production: https://hiring-remote.vercel.app
GitHub: https://github.com/joblessSince1997asEngineer/hiring-remote
Auto-deploys on git push origin main

## Stack
- Next.js 16.2.12 (App Router, Turbopack) + TypeScript + Tailwind v4
- Prisma 7 + PostgreSQL (Supabase ap-southeast-1, session pooler 5432)
- Auth: signed HMAC cookie sessions
- Emails: Resend (SANDBOX - domain not verified yet)
- File storage: Supabase Storage (CVs)
- Payments: Stripe (planned, not built)
- Toasts: sonner
- npm, Windows 11, PowerShell 5.x (no && - use ; or separate commands)

## CRITICAL environment notes
- Prisma migrate dev FAILS on network -> use Supabase SQL Editor + npx prisma generate
- CHECKPOINT_DISABLE=1 speeds up prisma generate
- Vercel env has NODE_TLS_REJECT_UNAUTHORIZED=0 (temporary)
- Always npm run build locally before pushing
- Restart dev server after editing .env or schema.prisma
- Schema change flow: edit schema -> SQL in Supabase -> npx prisma generate

## Roles
- candidate: applies, edits own profile, views own applications/interviews
- recruiter: CLIENT (pays, submits hiring requests, requests interviews/hires)
- admin / super_admin: platform owner, sees everything

## Key models
- Application (status: pending -> shortlisted -> hire_pending -> awaiting_payment -> hired / rejected / hire_cancelled)
  - source: 'self_applied' | 'admin_assigned'
  - hirePlan, hireNotes, hireRequestedAt, invoice relation
- Interview (status: pending -> scheduled -> completion_requested -> completed / cancelled)
  - clientRequestedToAttend, requestedByUserId
- Invoice (created on hire approval, 15-day dueAt, tier discounts 50/25/15%)
- Subscription (annual $5,000 first year, $4,000 renewal)
- Notification (in-app bell, backend writes exist, UI hardcoded)
- CandidateProfile (userId-linked, candidate master record)
- ContactMessage (contact form submissions)
- Client_Requests (client hiring requests - pending_review/approved/rejected)
  - userId field links to User
  - new fields: seniority, remoteType, location, currency, budgetPeriod, urgency, requirements, contactName, companyWebsite, companySize
- Job (new fields: seniority, remoteType, currency, salaryPeriod, skills[], responsibilities, requirements, niceToHave, applicationDeadline, status)
- Profiles (OLD - orphaned, replaced by CandidateProfile)
- Job_Assignments (OLD - orphaned, replaced by Application.source)

## Hire flow
1. Candidate applies to Job (public /jobs page)
2. Client requests interview (from /dashboard/applications)
3. Admin schedules interview (from /dashboard/interviews)
4. Interview happens -> admin marks complete (client can request -> admin confirms)
5. Client clicks "Request Hire" -> picks plan -> status = hire_pending
6. Admin approves at /dashboard/hire-approvals -> creates Invoice -> status = awaiting_payment
7. (TODO) Client pays via Stripe -> webhook -> status = hired

## Client hiring request flow (separate path)
1. Client visits /request-job (via homepage "Hire Talent" button or footer)
2. Fills 4-step form (Company / Role / Budget / Review)
3. Admin reviews at /dashboard/client-requests
4. Admin approves -> Job created automatically with all fields
5. Job appears at /jobs (public) and /dashboard/jobs (client sees own)
6. Client tracks via /dashboard/my-requests

## Role-based data isolation
| Page | Admin | Client |
|---|---|---|
| /dashboard (KPIs) | All | Own jobs |
| /dashboard/jobs | All | Own jobs |
| /dashboard/applications | All | Own jobs |
| /dashboard/interviews | All | Own jobs |
| /dashboard/candidates | All | Blocked |
| /dashboard/hire-approvals | Yes | No |
| /dashboard/client-requests | Yes | No |
| /dashboard/contact-messages | Yes | No |
| /dashboard/team | Yes | No |
| /dashboard/my-requests | No | Yes |
| /dashboard/analytics | Yes | No |
| /jobs (public) | All | All |

## Security measures in place
- bcrypt password hashing (lazy migration on login from old base64)
- Session signing HMAC-SHA256 (lib/session.ts, lib/auth.ts)
- getUserId() verifies signature on every request
- Server-side logout via /api/logout
- Rate limiting (lib/rate-limit.ts):
  - login 5/15min
  - register 3/hr
  - contact 3/hr
  - apply 10/hr
  - forgot-password 3/hr
  - client-requests 3/hr
- httpOnly + sameSite=lax + secure cookies
- Custom 404/error pages

## Completed
- Mobile responsive shell + sidebar + topbar
- Footer + legal pages (privacy/terms/cookies)
- Candidate dashboard + profile edit + CV upload
- Toast notifications (all alerts replaced)
- Loading skeletons
- Team page (aligned photos, conditional justify)
- Pricing page (annual $5K, renews $4K, tier discounts)
- Contact form -> DB + admin view
- Interview completion flow + cancel feature
- Hire approvals page + invoice creation
- Talent pool switched to CandidateProfile + completeness filter
- Dashboard role-based KPIs
- Vercel deployment live
- Industry-level admin Post Job form (10+ fields)
- Industry-level client Request Hire form (4 steps)
- /dashboard/my-requests page
- All role-based data isolation
- Session signing (40 files migrated to getUserId())
- Rate limiting on public routes
- Custom 404/error pages
- Team page rewrite
- Jobs "View Applicants" -> filtered applications
- Assign feature creates Application records

## Known issues / TODOs
- Bell notification count hardcoded
- Search bar in DashboardTopBar does nothing
- TLS via env var global (should be scoped to Prisma)
- Supabase in Singapore -> slow from India (consider Mumbai)
- CV bucket may be public - verify + migrate to signed URLs
- Old Profiles + Job_Assignments models orphaned - drop in cleanup
- app/client/page.tsx + ClientDashboard.tsx unused
- No pagination on application/job/candidate lists
- admin@example.com still in some email routes
- Password reset emails don't work (Resend sandbox)

## Promotion SQL (owner to admin)
UPDATE "Roles" SET role = 'admin' WHERE user_id = (SELECT id FROM "User" WHERE email = 'owner@email.com');

## Contact
- Admin email: hr@remotehirring.com
- Domain: remotehirring.com (NOT purchased yet)

## Path to Tier-2 (~35 hrs remaining)

### Phase A - Launch essentials (~13 hrs) - DO THIS SUNDAY
1. Buy remotehirring.com (10 min)
2. Add DNS records in Namecheap (SPF/DKIM/DMARC from Resend)
3. Verify domain in Resend (30 min)
4. Replace onboarding@resend.dev with noreply@remotehirring.com
5. Replace admin@example.com with hr@remotehirring.com
6. Stripe account setup + keys (1 hr)
7. Phase 4: Stripe checkout API + invoice page (3 hrs)
8. Phase 5: Stripe webhook -> mark hired (2 hrs)
9. Email templates branded HTML (2 hrs)
10. Rotate credentials: DB password, Resend key, SESSION_SECRET (10 min)
11. CV bucket -> private + signed URLs (30 min)
12. Fix TLS via Prisma ssl config (30 min)
13. Sentry free tier (1 hr)
14. End-to-end manual test (2 hrs)

### Phase B - Professional polish (~10 hrs)
15. Bell notifications (real data)
16. Search bar wired up
17. SEO meta + OG image + sitemap
18. Performance: parallel queries, caching, Supabase Mumbai
19. Interview .ics calendar invites
20. Analytics dashboard with real charts

### Phase C - Scale safety (~18 hrs)
21. Playwright E2E tests
22. CI/CD (tests on push)
23. Staging environment
24. Cookie consent banner
25. GDPR export/delete endpoints
26. Admin audit log

### Phase D - Security extras (~5 hrs)
27. 2FA for admin accounts
28. Redis rate limiting

## Environment variables (Vercel Production)
- DATABASE_URL (Supabase pooler, sslmode=require)
- SESSION_SECRET
- RESEND_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NODE_TLS_REJECT_UNAUTHORIZED=0 (temporary)

## Deployment notes
- Push to main -> auto-deploys
- Vercel env changes require manual Redeploy
- Env vars are STATIC - update Vercel after rotating locally
- If build fails: check Vercel -> Deployment -> Build Logs
- Network hiccups on git push: retry, ipconfig /flushdns, or wait 5 min

## How to continue in new chat
1. Paste this PROJECT.md
2. Paste current file being edited (if any)
3. Say "continue with [task]"

## Weekend goal
Phase A only. Focus: domain + Resend + Stripe.
No Phase B/C/D work until first paying customer.