# Gotchas & Lessons Learned

## Profile ID vs User ID (CRITICAL)
- `profile.id` ≠ `profile.user_id` ≠ `auth.users.id` — always use `profile.id` for DB operations
- All FK columns (`creator_id`, `user_id`) reference `profiles.id`, not `auth.users.id`
- Bug was hidden because some users' `profile.id` coincidentally equaled `profile.user_id`

## JavaScript Falsy Zero Bug (CRITICAL)
```javascript
// WRONG: 0% fee becomes 6.9%
const feePercent = plan?.platform_fee_percent || 6.9;
// CORRECT: only falls back for null/undefined
const feePercent = plan?.platform_fee_percent ?? 6.9;
```

## RLS Policy Creation (CRITICAL)
- **Always include `TO authenticated` or `TO anon`** — omitting defaults to `PUBLIC` pseudo-role which authenticated users can't use
- After migration, verify: `SELECT policyname, roles FROM pg_policies WHERE tablename = 'your_table';`
- For public data, add policies for BOTH `anon` AND `authenticated` roles
- Use `get_my_profile_id()` in policies for tables storing profile IDs, NOT `auth.uid()`

## Stripe Integration
- **Webhook idempotency**: Store `stripe_event_id` in `webhook_events`, check before processing
- **Currency in cents**: All DB amounts are integer cents (€30 = 3000)
- **Webhook endpoint MUST deploy with `--no-verify-jwt`** — Supabase gateway returns 401 before function runs
- **Sale amount**: Always use `session.amount_total` (actual charged), NOT `community.price_cents` (list price)
- **Fee estimation**: Webhook uses `amount * 2.9% + €0.25` (conservative estimate)
- **Live mode webhook**: Must configure separately from test mode in Stripe Dashboard
- **Webhook sale recording**: TWO idempotency layers — `webhook_events` table + `creator_sales` duplicate check

## Billing Data Flow (Destination Charges)
All student payments use **Stripe Connect destination charges** — platform never holds funds:
| Table | What it stores | Who writes |
|-------|---------------|------------|
| `community_purchases` | Purchase records | community-checkout + stripe-webhook |
| `creator_sales` | Revenue for analytics (read-only mirror) | stripe-webhook |
| `billing_transactions` | Activation fee and subscription events | stripe-webhook |
| `creator_billing` | Plan, Stripe IDs, Connect account | stripe-webhook |

**Deprecated tables** (wallet model remnants, no longer written to):
`pending_balances`, `balance_transactions`, `payouts`, `reserve_releases`

## Stripe Environment Variable Name
- Frontend code expects `VITE_STRIPE_PUBLIC_KEY` (NOT `VITE_STRIPE_PUBLISHABLE_KEY`)
- Mismatch causes Stripe.js to silently fail to load

## Supabase Edge Functions
- **Shared code**: Import from `../_shared/`
- **MCP deployment gotcha**: `deploy_edge_function` doesn't resolve `../_shared/` imports — use CLI
- **CORS**: Headers must be set for browser requests
- **Secrets**: Use `supabase secrets set` (or `npx supabase secrets set`)

## Internationalization (i18n)
- **Default language**: Bulgarian (bg)
- **Verify BOTH locale files** after any UI change: `en.json` AND `bg.json`
- **Structure must match**: Nested keys in bg.json must mirror en.json exactly
- **Pluralization** (i18next v21+): Use `_one`/`_other` suffixes, NOT `_plural`
- **Bio vs Biography**: `profiles.bio` (short, community interactions) vs `creator_profiles.bio` (marketing, landing page)

## Discount Codes
- **100% discount**: Skip Stripe entirely, grant access server-side when `finalPriceCents <= 0`
- **`community_purchases` NOT NULL columns**: Must include `stripe_fee_cents` and `creator_payout_cents` (no defaults)

## TBI Bank Fusion Pay (BNPL)
- API URL: `https://beta.tbibank.support/api` — "beta" IS production
- Encryption: AES-256-CBC, key=first 32 bytes, IV=first 16 bytes of key
- Deploy always via CLI, NOT MCP
- Known PHP 8 bug (2026-02-11) in RegisterApplication — GetCalculations works fine

## Vercel Cron
- Free tier cannot use cron — use GitHub Actions with `schedule:` triggers instead
- Cron authentication: Edge functions verify `CRON_SECRET` in request body

## Routing
- Don't use `allowedRoles` on routes if `AppLayout` already handles role-based content
- `getDefaultRedirectPath(role)` in `App.tsx` handles post-login redirect

## Database Migration (CC → FC)
- **Supabase pooler** (`aws-0-eu-central-1`) does NOT work — use CLI pooler (`aws-1-eu-west-1`) from `supabase db dump --dry-run`
- **Schema differences**: CC has extra columns FC doesn't (bio, vsl_url, group_id, display_order, stripe_customer_id, is_pinned)
- **auth.identities**: `email` column is `GENERATED ALWAYS` in FC — cannot insert non-DEFAULT values
- **RLS `TO PUBLIC` silent failure**: 61 policies had no role specified → defaults to `PUBLIC` pseudo-role which authenticated users can't use. Always verify with `SELECT policyname, roles FROM pg_policies`
- **CC MCP dual-project setup**: Configure `.mcp.json` with both `supabase` (FC) and `supabase-cc` (CC) for read-only access to CC data
- **Storage files**: ~11.2GB on CC storage remain accessible via public URLs; new uploads go to FC buckets
- **Migration status (2026-03-09)**: FC is superset of CC — 72 tables, 76 functions, 257 policies. Still missing from CC: modules, lessons, events, event_attendees, lesson_progress, quiz_attempts (need MCP on CC to extract)
