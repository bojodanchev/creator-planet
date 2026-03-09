# Decision: Switch from Wallet Model to Stripe-Managed Destination Charges
**Date**: 2026-03-09
**Status**: accepted

## Context
The original billing system used a wallet model where the platform collected 100% of student payments, tracked creator balances in a custom DB system (pending/available/reserved/negative), and processed payouts via weekly cron jobs through Stripe Connect transfers. This required:
- 4 extra DB tables (pending_balances, balance_transactions, payouts, reserve_releases)
- 6 balance columns on creator_billing
- 3 edge functions (release-pending-balances, process-payouts, creator-withdrawal)
- GitHub Actions cron jobs for daily/weekly processing
- Complex chargeback waterfall logic

Additionally, holding creator funds in a platform wallet creates regulatory risk under EU PSD2/EMD2 — potentially requiring a payment institution license from BNB (Bulgarian National Bank).

## Decision
Switch to **Stripe-managed destination charges** where:
1. Student payments go directly to the creator's Connect account via `transfer_data.destination`
2. Platform fee is automatically deducted via `application_fee_amount`
3. Stripe handles payout scheduling, chargeback management, and tax reporting
4. Platform DB only stores a read-only mirror of sales for analytics

Also removed the "monthly fee starts after first sale" trigger — monthly fees now start immediately on plan selection. Activation fee (€9.90) serves as the creator verification gate.

## Alternatives Considered
1. **Keep wallet model** — More control over holds/reserves/payouts, but complex, regulatory risk, reconciliation challenges between DB and Stripe state
2. **Separate charges + transfers** — Payment to platform first, then transfer creator share. More visibility for platform but extra API calls and complexity

## Consequences
- **Removed ~1,170 lines** of wallet/balance/payout code
- **Eliminated regulatory risk** — platform never holds creator funds
- **Simplified webhook** — 8 events instead of 12, no balance manipulation
- **Stripe is single source of truth** for money — no reconciliation needed
- **Trade-off**: Less control over payout timing (Stripe's schedule, not ours)
- **Trade-off**: Can't implement custom hold periods or reserves without Stripe's own tools
- **Deprecated tables remain** in schema (harmless) — can be dropped in future migration
