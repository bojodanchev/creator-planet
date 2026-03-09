# Billing System

## Architecture
Hybrid pricing model with **Stripe-managed money flow** (no platform wallet):
- **One-time activation fee** (€9.90) — creator verification
- **Fixed monthly subscription** (Pro/Scale) — starts immediately on plan selection
- **Percentage-based platform fee** on all student sales via destination charges
- **Stripe Connect** handles creator payouts directly — platform never holds funds

## Creator Plans
| Plan | Monthly Fee | Platform Fee | Features |
|------|-------------|--------------|----------|
| Starter | €0 | 6.9% | 50 students, 2 courses, 1 community |
| Pro | €30 | 3.9% | 500 students, 10 courses, 3 communities |
| Scale | €99 | 1.9% | Unlimited, white-label, API access |

## Stripe Account
- **Account**: European Fashion Institute (`acct_1Sra05HH4asvT4B6`)
- **Mode**: Live

## Stripe Products & Prices
| Product | Product ID | Price ID | Amount |
|---------|-----------|----------|--------|
| Activation Fee | `prod_U7OhnGQypJ2jxm` | `price_1T99uIHH4asvT4B64GBdjLWI` | €9.90 one-time |
| Pro Plan | `prod_U7OhXerO5LD9ZL` | `price_1T99uJHH4asvT4B6iDDYERzT` | €30/month |
| Scale Plan | `prod_U7OhTEVS1XIzWU` | `price_1T99uJHH4asvT4B6dMW4xaK2` | €99/month |

Community/course products are created dynamically by creators when they set prices.

## Payment Flows

### 1. Creator → Platform (direct charges)
- Activation fee: €9.90 one-time via Checkout Session
- Plan subscription: €0/€30/€99 per month via Stripe Subscriptions
- Billed directly to platform Stripe account. No Connect involved.

### 2. Student → Creator (destination charges)
- Community membership (one-time or monthly) and course purchases
- Payment goes to creator's Connected Account via `transfer_data.destination`
- `application_fee_amount` deducts platform fee (6.9%/3.9%/1.9% based on plan)
- Stripe handles payouts to creator on their own schedule

### 3. Creator Connect Onboarding
- Creator signs up → pays activation → picks plan → connects Stripe (Express account)
- Must complete Connect onboarding before they can charge students

## Webhook Configuration
- **Endpoint**: `https://ilntxxutxbygjuixrzng.supabase.co/functions/v1/stripe-webhook`
- **Webhook ID**: `we_1T9A2QHH4asvT4B6mXzA1hum`
- **Events**: checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.created/updated/deleted, payment_intent.succeeded, account.updated

## Database Tables (active)
| Table | Purpose |
|-------|---------|
| `billing_plans` | Plan configurations (seeded via migration) |
| `creator_billing` | Creator billing state, Stripe IDs, Connect account |
| `billing_transactions` | Transaction ledger (activation, subscription events) |
| `creator_sales` | Sales records for analytics display (read-only mirror) |
| `webhook_events` | Idempotent webhook processing log |
| `community_purchases` | Community purchase records |

## Database Tables (deprecated — wallet model remnants)
These tables exist in the schema but are no longer written to:
- `pending_balances`, `balance_transactions`, `payouts`, `reserve_releases`
- Balance columns on `creator_billing` (pending/available/reserved/negative)

## Edge Functions
| Function | Purpose | Auth |
|----------|---------|------|
| `stripe-checkout` | Create Checkout sessions (activation, subscription, payment intent) | JWT |
| `stripe-subscription` | Manage subscriptions (change plan, cancel, resume, billing portal) | JWT |
| `stripe-connect` | Creator Express account onboarding & status | JWT |
| `stripe-webhook` | Handle Stripe webhook events | Stripe signature |
| `community-checkout` | Paid community access checkout | No JWT |

## Billing Settings Page
- **Revenue Overview** — aggregates from `creator_sales`
- **Community Sales** — individual `creator_sales` records
- **Plan Management** — upgrade/downgrade/cancel via Stripe Billing Portal
