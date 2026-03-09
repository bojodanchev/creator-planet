# Environment

## Prerequisites
- Node.js (v18+)
- npm
- Supabase CLI (`supabase` v2.75+)

## Setup
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview production build
```

## Deployment & Testing
- **Production URL**: https://founderclub.bg
- **Hosting**: Vercel (auto-deploys from `main` branch on GitHub push)
- **Testing**: Use the production URL for browser testing, NOT localhost

## Required Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=https://ilntxxutxbygjuixrzng.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>

# Stripe (client-side)
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Stripe (server-side - Supabase secrets)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI
VITE_GEMINI_API_KEY=<gemini_key>

# Cron (GitHub Actions + Supabase Edge Functions)
CRON_SECRET=<secure_random_string>
```

## Key Dependencies
- `@stripe/react-stripe-js` + `@stripe/stripe-js` - Stripe integration
- `@supabase/supabase-js` - Database client
- `@google/genai` - Gemini AI
- `react-router-dom` - Routing
- `recharts` - Charts/analytics
- `lucide-react` - Icons
- `@vercel/analytics` - Vercel Analytics

## External Services
- **Supabase** (`ilntxxutxbygjuixrzng`): Database, Auth, Edge Functions, Storage
- **Stripe**: Payments, Subscriptions, Connect payouts
- **Gemini API**: AI Success Manager, Community Chatbots (model: Gemini 2.0 Flash)
- **Vercel**: Hosting, Analytics
- **TBI Bank**: BNPL (installment payments) — see `docs/tbi/`

## Supabase Direct DB Access
For bulk SQL operations, use CLI pooler credentials (obtained via `supabase db dump --dry-run`):
- Host: `aws-1-eu-west-1.pooler.supabase.com:5432`
- User: `cli_login_postgres.ilntxxutxbygjuixrzng`
- Must `SET ROLE postgres` after connecting for full access
- The standard pooler (`aws-0-eu-central-1.pooler.supabase.com`) does NOT work for this project

## Edge Functions
Located in `supabase/functions/`:
| Function | Purpose |
|----------|---------|
| `stripe-checkout` | Create Checkout sessions |
| `stripe-subscription` | Manage subscriptions |
| `stripe-connect` | Creator payout onboarding |
| `stripe-webhook` | Handle Stripe webhooks (deploy with `--no-verify-jwt`) |
| `community-checkout` | Paid community access checkout (deploy with `--no-verify-jwt`) |
| `admin-reset-password` | Admin: reset user passwords |
| `ai-chat` | Community chatbot AI |
| `tbi-checkout` | TBI BNPL checkout |

## Scheduled Jobs
None active. Balance cron jobs removed with wallet model (2026-03-09).

## Admin Operations

### Password Reset
```sql
UPDATE auth.users SET encrypted_password = crypt('NEW_PASS', gen_salt('bf')), updated_at = now() WHERE email = 'user@example.com';
```

### Email Deliverability
Supabase built-in email has poor deliverability. Long-term fix: Configure custom SMTP (Resend, Postmark, SendGrid).
