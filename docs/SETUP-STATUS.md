# Creator Planet — Setup Status

## Overview

Creator Planet is an independent instance of the Creator Club platform, deployed as a separate project with its own Supabase backend, Vercel frontend, and shared Stripe account (KINGDOM LTD). This document tracks the setup progress, completed phases, and remaining tasks.

## Infrastructure

| Component | Value |
|-----------|-------|
| **GitHub Repo** | https://github.com/bojodanchev/creator-planet |
| **Local Directory** | ~/new-creator-club/ |
| **Supabase Project Ref** | ilntxxutxbygjuixrzng |
| **Supabase URL** | https://ilntxxutxbygjuixrzng.supabase.co |
| **Supabase Region** | eu-central-1 |
| **Stripe Account** | KINGDOM LTD (acct_1SoV6VEHrm7Q2JIn) — shared with Creator Club |
| **Stripe Products** | Same IDs as Creator Club (see products table below) |
| **Vercel URL (planned)** | creator-planet.vercel.app (not yet deployed) |
| **Vercel Deployment** | Auto-deploy from main branch (when configured) |

## Stripe Configuration

### Business Account: KINGDOM LTD
- **Account ID**: `acct_1SoV6VEHrm7Q2JIn`
- **Mode**: Live only (single account, no test mode)
- **Connect**: Express accounts enabled
- **Shared with**: Original Creator Club instance (both instances share same products)

### Product & Price IDs (Shared)

| Product | Product ID | Price ID | Amount |
|---------|------------|----------|---------|
| **Activation Fee** | `prod_Tm3yvErLQFwjjM` | `price_1Sput3EHrm7Q2JInE9dmsu4c` | €9.90 (one-time) |
| **Pro Plan** | `prod_Tm3yo6o2IkxEjW` | `price_1SoVqmEHrm7Q2JIncZnyu9SY` | €30/month |
| **Scale Plan** | `prod_Tm3yyZw4qEQRGI` | `price_1SoVqmEHrm7Q2JInneH7wG9d` | €99/month |
| **Student Plus** | `prod_Tm3yaCvF6DUXMN` | `price_1SoVqnEHrm7Q2JInAADYSo3z` | €9.90/month |

**Note**: Both Creator Club and Creator Planet instances use the same Stripe products. Each instance only processes webhook events matching its own database records. Webhook cross-talk is handled gracefully via stripe_event_id idempotency checks.

## Completed Phases

### Phase 1: Source Code Copy ✅

**Status**: Complete

- All source files copied from ~/creator-club™/ via rsync
- Excluded: node_modules, dist, .git, .claude, .supabase-emails, .playwright-mcp, .codex-council, supabase/.temp
- Fresh git repo initialized: `git init && git remote add origin https://github.com/bojodanchev/creator-planet.git`
- Pushed to GitHub as private repo
- All 316 npm packages installed successfully

### Phase 2: Supabase Project ✅

**Status**: Complete

- **Project created**: ilntxxutxbygjuixrzng (eu-central-1)
- **CLI linked**: `npx supabase link --project-ref ilntxxutxbygjuixrzng`
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbnR4eHV0eGJ5Z2p1aXhyem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTUwNDQsImV4cCI6MjA4NzMzMTA0NH0.NFwYHJdwAKyArTAVMXnrf1RiDrG2zc2VB4rX2QbKhgs

### Phase 3: Database Migrations ✅

**Status**: Complete

- All 35+ migrations applied successfully
- **Public tables created**: 48 tables including:
  - Core: profiles, auth.users
  - Communities: communities, community_team_members, memberships
  - Courses: courses, modules, lessons, progress, quiz_responses
  - Billing: billing_plans, creator_billing, creator_sales, balance_transactions, payouts
  - Calendar: events, event_attendees
  - Messaging: conversations, direct_messages
  - And more...
- **Billing plans seeded**: Starter, Pro, Scale
- **Storage buckets created**: course-thumbnails, avatars (with RLS policies)
- **Migration fixes applied**:
  - Duplicate version keys resolved (001, 016 prefixes)
  - `get_my_profile_id()` added to migration 013
  - Enum-in-transaction fix in migration 035
  - Storage buckets migration added as 036

### Phase 4: Stripe Products ✅

**Status**: Complete

- Using SAME product/price IDs as original Creator Club
- Shared KINGDOM LTD Stripe account (acct_1SoV6VEHrm7Q2JIn)
- All 4 products available: Activation Fee, Pro Plan, Scale Plan, Student Plus
- **Webhook endpoint**: NOT YET created (see Phase 9: Remaining Tasks)

### Phase 5: Hardcoded References Updated ✅

**Status**: Complete

- **Supabase ref**: znqesarsluytxhuiwfkt → ilntxxutxbygjuixrzng (19 files)
- **Domain**: creatorclub.bg → creator-planet.vercel.app (4 files, conservative estimate)
- **Files updated**:
  - src/features/direct-messages/teamService.ts (INVITE_BASE_URL)
  - supabase/functions/_shared/tbi.ts
  - supabase/functions/stripe-connect/index.ts
  - supabase/functions/community-checkout/index.ts
  - playwright.config.ts (test URLs)
  - tests/fixtures/test-config.ts (test URLs)
  - .env (new credentials)
- **Verification**: 0 matches for old refs in code files
- **Stripe IDs**: Left unchanged (shared account)

### Phase 6: Supabase Secrets (Partial) ✅

**Status**: Partially Complete

**Already set**:
- `CRON_SECRET`: fef8f1bb60a3fdcc4c7c9b76c192b726fca7e2cce040e5a80cab0dc4747a1e5b
- `TBI_RESELLER_KEY`: creatorclub

**NOT yet set** (require manual input from Stripe/TBI):
- `STRIPE_SECRET_KEY` — same sk_live_... key from original Stripe account
- `STRIPE_WEBHOOK_SECRET` — generated after webhook endpoint is created
- `TBI_ENCRYPTION_KEY` — same as original (use --env-file for special chars)
- `TBI_WEBHOOK_SECRET` — optional, only if TBI webhooks configured
- `VITE_GEMINI_API_KEY` — for AI features (optional initially)

### Phase 7: Edge Functions Deployed ✅

**Status**: Complete

All 22 edge functions deployed and showing ACTIVE status in Supabase Dashboard.

**Standard functions** (with JWT verification) — 17 functions:
- admin-reset-password
- ai-chat
- community-portal
- creator-withdrawal
- delete-account
- discount-validate
- generate-weekly-report
- remove-student
- stripe-checkout
- stripe-connect
- stripe-subscription
- student-plus-checkout
- student-plus-portal
- tbi-calculator
- tbi-cancel
- tbi-checkout
- tbi-status-check

**No-verify-JWT functions** (webhook receivers + cron) — 5 functions:
- stripe-webhook
- community-checkout
- tbi-webhook
- release-pending-balances
- process-payouts

### Phase 8: Build Verified ✅

**Status**: Complete

- **npm install**: 316 packages, 0 errors
- **npm run build**: succeeds (7.73s)
- `.env` file created with new Supabase credentials
- `.env` added to `.gitignore`
- **NOT yet deployed to Vercel** (depends on Phase 9 completion)

---

## Remaining Tasks

### 1. Set Remaining Supabase Secrets

**Status**: PENDING

Set the following environment secrets in Supabase Dashboard → Project Settings → Secrets, or via CLI:

```bash
cd ~/new-creator-club

# Stripe secret key (obtain from Stripe Dashboard → Developers → API Keys)
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_51SoV6VEHrm7Q2JIn...

# After creating webhook endpoint (see task 2):
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# TBI encryption key (use env-file approach for special characters)
echo 'TBI_ENCRYPTION_KEY=<your-key-here>' > /tmp/tbi.env
npx supabase secrets set --env-file /tmp/tbi.env
rm /tmp/tbi.env

# Optional: Gemini AI key (for AI Success Manager and chatbots)
npx supabase secrets set VITE_GEMINI_API_KEY=...
```

**References**:
- Stripe keys: https://dashboard.stripe.com/apikeys
- TBI encryption key: Same value used in original Creator Club
- Gemini API key: https://ai.google.dev/

### 2. Create Stripe Webhook Endpoint

**Status**: PENDING

Configure webhook in Stripe Dashboard → Developers → Webhooks → Add endpoint:

**Configuration**:
- **URL**: `https://ilntxxutxbygjuixrzng.supabase.co/functions/v1/stripe-webhook`
- **Events to listen for**:
  - checkout.session.completed
  - invoice.paid
  - invoice.payment_failed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - account.updated
  - charge.dispute.created
  - charge.dispute.closed
- **Copy signing secret** (whsec_...) and set as `STRIPE_WEBHOOK_SECRET` (Task 1)
- **Webhook ID**: Store for reference (starts with we_)

**Important**: Must configure for **live mode**, not test mode.

### 3. Deploy to Vercel

**Status**: PENDING

Choose one approach:

**Option A — Import from GitHub (Recommended)**:
1. Go to https://vercel.com → New Project → Import Git Repository
2. Select `bojodanchev/creator-planet`
3. Configure environment variables (see table below)
4. Click Deploy

**Option B — Vercel CLI**:
```bash
cd ~/new-creator-club
npx vercel --prod
```

**Environment Variables for Vercel**:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | https://ilntxxutxbygjuixrzng.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbnR4eHV0eGJ5Z2p1aXhyem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTUwNDQsImV4cCI6MjA4NzMzMTA0NH0.NFwYHJdwAKyArTAVMXnrf1RiDrG2zc2VB4rX2QbKhgs |
| `VITE_STRIPE_PUBLISHABLE_KEY` | pk_live_51SoV6VEHrm7Q2JInCEsVU5V8B5FTbQ3xluPeNQh93eXL7x8VkzqpLlL9O2O2C6VQDvzInR2DscE5tSEH3BSPNUPO003rnmpGHw |
| `VITE_GEMINI_API_KEY` | (optional, for AI features) |

**Post-deployment**: Update Supabase Auth settings (Task 4).

### 4. Configure Supabase Auth

**Status**: PENDING

After Vercel deployment, update Supabase auth settings:

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: https://creator-planet.vercel.app (or your custom domain)
- **Redirect URLs**: Add these patterns:
  - https://creator-planet.vercel.app/**
  - (If using custom domain later: add that domain too)
- **Enable Email Provider**: Already enabled by default
- **OAuth Providers** (optional): Configure GitHub, Google, etc. as needed

### 5. Configure GitHub Actions

**Status**: PENDING

Add repository secret to creator-planet GitHub repo for scheduled cron jobs.

**Steps**:
1. Go to GitHub → creator-planet repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret:
   - **Name**: CRON_SECRET
   - **Value**: fef8f1bb60a3fdcc4c7c9b76c192b726fca7e2cce040e5a80cab0dc4747a1e5b
4. Save

**Verify**: Go to Actions → "Balance System Cron Jobs" → Run workflow manually to test.

**Cron jobs configured** (in `.github/workflows/`):
- **Daily 6:00 AM UTC**: Release pending balances (7-day hold) → available
- **Friday 9:00 AM UTC**: Process automatic payouts (batch withdraw requests)

### 6. Configure Custom SMTP (Optional but Recommended)

**Status**: PENDING (Optional)

Supabase's built-in email (`noreply@mail.app.supabase.io`) has poor deliverability. Recommend configuring custom SMTP:

**Steps**:
1. Supabase Dashboard → Authentication → SMTP Settings
2. Choose provider: Brevo, Resend, Postmark, or SendGrid
3. Enter SMTP credentials
4. Test with: Supabase Dashboard → Authentication → Templates → Send test email

**Note**: This is optional for MVP but critical for production.

### 7. Update Vercel URL References (If Different)

**Status**: PENDING (Only if URL differs from creator-planet.vercel.app)

If Vercel assigns a different URL or you add a custom domain, update:

- **src/features/direct-messages/teamService.ts**: Update `INVITE_BASE_URL`
- **Supabase Auth**: Add redirect URLs for new domain
- **This document**: Update all references to creator-planet.vercel.app

---

## Smoke Test Checklist

**Run these tests after completing all remaining tasks:**

- [ ] Navigate to https://creator-planet.vercel.app — site loads without errors
- [ ] Create new creator account (signup flow)
- [ ] Create new student account
- [ ] Creator login/logout works
- [ ] Creator dashboard loads with empty state
- [ ] Creator can create a community
- [ ] Creator can start Stripe checkout for activation fee
- [ ] Verify Stripe Dashboard → Webhooks → Recent deliveries shows successful events
- [ ] Verify webhook creates records in Supabase (check creator_billing, webhook_events)
- [ ] Student can browse communities and join
- [ ] Creator can create a course with modules/lessons
- [ ] Student can view course progress
- [ ] AI chat responds (if Gemini key configured)
- [ ] TBI calculator returns installment options (if TBI_ENCRYPTION_KEY set)
- [ ] File uploads work (avatar, course thumbnail)
- [ ] Cron job manual trigger succeeds (GitHub Actions)
- [ ] Email notifications send (if SMTP configured)

---

## Key Differences from Original

| Aspect | Creator Club (Original) | Creator Planet (Clone) |
|--------|------------------------|----------------------|
| **Supabase Project Ref** | znqesarsluytxhuiwfkt | ilntxxutxbygjuixrzng |
| **Production Domain** | creatorclub.bg | creator-planet.vercel.app |
| **GitHub Repo** | bojodanchev/creator-club | bojodanchev/creator-planet |
| **Stripe Account** | KINGDOM LTD (shared) | KINGDOM LTD (shared) |
| **Stripe Products** | Same IDs | Same IDs |
| **Database** | Independent (separate Supabase) | Independent (separate Supabase) |
| **Users/Data** | Separate | Separate |
| **Edge Functions** | Deployed on znqesarsluytxhuijfkt | Deployed on ilntxxutxbygjuixrzng |
| **Webhooks** | Single webhook, shared products | Single webhook (shared), shared products |

---

## Architecture & Billing Notes

### Shared Stripe Account Implications

Both Creator Club and Creator Planet share the same KINGDOM LTD Stripe account (`acct_1SoV6VEHrm7Q2JIn`) and product IDs. This means:

- **Checkout sessions**: Both instances can create checkout sessions using the same products
- **Webhooks**: Single webhook endpoint cannot serve both instances
  - **Workaround**: Each instance subscribes to stripe events via `stripe_event_id` deduplication
  - Events routed via database checks: if a creator record exists in that instance's DB, process the event; otherwise ignore
  - **Current Configuration**: Two separate webhook endpoints (one for each Supabase project)
- **Product updates**: Changing a product in Stripe affects both instances
- **Creator Connect accounts**: Users can be creators in both instances (separate profile records)

### Database Schema

Creator Planet has independent database with:
- 48 public tables
- 3 billing plans (Starter, Pro, Scale)
- 2 storage buckets (course-thumbnails, avatars)
- Full RLS policies for multi-tenant isolation

See `supabase/migrations/` for complete schema.

### Edge Functions

All 22 edge functions deployed:
- 17 standard functions with JWT verification
- 5 webhook/cron functions with `--no-verify-jwt` flag

Deploy note: Use CLI for functions with `_shared/` imports:
```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## Support & Troubleshooting

### Common Issues

**Webhook returns 401**
- Cause: Edge function deployed with `verify_jwt: true`
- Fix: `npx supabase functions deploy stripe-webhook --no-verify-jwt`

**Stripe key errors**
- Cause: STRIPE_SECRET_KEY not set or incorrect
- Fix: Check Supabase Secrets and verify key starts with `sk_live_`

**Supabase migrations fail**
- Cause: Previous migration partially applied
- Fix: Check `supabase/migrations/` for duplicate version keys
- Already fixed in this instance (see Phase 3)

**Email not sending**
- Cause: Supabase built-in email has poor deliverability
- Fix: Configure custom SMTP (Task 6)

### Debug Commands

```bash
# View Supabase logs
supabase functions list
supabase functions logs stripe-webhook

# Check secrets
npx supabase secrets list

# Test database connection
npx supabase db pull

# Verify migrations
supabase migration list
```

---

## Timeline

| Phase | Status | Completed |
|-------|--------|-----------|
| Source Code Copy | ✅ | 2026-02-22 |
| Supabase Project | ✅ | 2026-02-22 |
| Database Migrations | ✅ | 2026-02-22 |
| Stripe Products | ✅ | 2026-02-22 |
| Hardcoded References | ✅ | 2026-02-22 |
| Supabase Secrets (Partial) | ✅ | 2026-02-22 |
| Edge Functions | ✅ | 2026-02-22 |
| Build Verified | ✅ | 2026-02-22 |
| **Remaining Tasks** | PENDING | — |
| Set Stripe Secrets | PENDING | — |
| Create Webhook Endpoint | PENDING | — |
| Deploy to Vercel | PENDING | — |
| Configure Auth | PENDING | — |
| Configure GitHub Actions | PENDING | — |
| Custom SMTP | PENDING | — |
| Smoke Tests | PENDING | — |

**Estimated completion**: 1-2 hours after remaining tasks started

---

## Next Steps

1. **Start here**: Set Supabase secrets (Task 1)
2. **Then**: Create Stripe webhook endpoint (Task 2)
3. **Then**: Deploy to Vercel (Task 3)
4. **Then**: Run smoke tests
5. **Finally**: Announce creator-planet.vercel.app is live

For questions or blockers, refer to original Creator Club at ~/creator-club™ and CLAUDE.md in the root of this project.
