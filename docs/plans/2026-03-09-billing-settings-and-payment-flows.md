# Billing Settings & Payment Flows — Complete Wiring
**Date**: 2026-03-09
**Status**: ready for implementation

## Goal
Wire all billing settings, payment flows, and creator onboarding into a complete, working system. Creator journey: signup → dashboard with nudges → complete setup → monetize.

## Architecture Decisions
- **Dashboard-first with nudges** — creators land on dashboard immediately, banners guide them to complete setup
- **Three gates before monetization** — activation fee, plan selection, Connect account
- **Gates enforced in UI** (CommunityPricingSettings) + **backend** (community-checkout edge function)
- **No Student Plus** — only creators subscribe; students pay creators for community access
- **No first-sale trigger** — monthly fees start immediately on plan selection

## Three Payment Flows

| Flow | Who pays | What | How |
|------|----------|------|-----|
| Activation | Creator → Platform | €9.90 one-time | Stripe Checkout |
| Subscription | Creator → Platform | €0/€30/€99 monthly | Stripe Checkout → Subscription |
| Community access | Student → Creator | Creator-set price | Destination charge via Connect |

## Implementation Tasks

### Task 1: BillingSettingsPage — Add Setup Checklist
**File**: `src/features/billing/pages/BillingSettingsPage.tsx`

Add a conditional setup checklist banner at the top of the page. Shows only when setup is incomplete (any of the 3 gates not met).

**Checklist items:**
1. **Activation fee** — check `billing.activation_fee_paid`. Action: link to `/onboarding`
2. **Choose plan** — check `billing.plan_id !== null`. Action: link to `/pricing`
3. **Connect payout account** — check `connectStatus?.status === 'active'`. Action: trigger `handleSetupPayouts()`

**UI spec:**
- Progress bar showing "X of 3 complete"
- Each step: green CheckCircle when done, clickable button when pending
- Entire section disappears when all 3 complete

**Verification**: Load billing settings with incomplete setup — see checklist. Complete all steps — checklist disappears.

### Task 2: BillingSettingsPage — Remove First-Sale and Trial UI
**File**: `src/features/billing/pages/BillingSettingsPage.tsx`

Remove from the Current Plan section:
- The "Activation & First Sale Status" grid (lines ~433-468) — activation moves to checklist, first-sale removed
- The trial CTA block (lines ~509-565) — no trials in the new model
- References to `billing.has_first_sale`, `billing.first_sale_at`, `billing.monthly_fee_active`

**Verification**: Build succeeds. BillingSettingsPage renders without errors.

### Task 3: PricingPage — Remove First-Sale References
**File**: `src/features/billing/pages/PricingPage.tsx`

Remove from the current plan banner (lines ~158-173):
- `billing.has_first_sale` check
- `billing.monthly_fee_active` check
- `billingStartsAfterSale` text

Replace with simple: "You're on the {planName} plan"

Also remove `showFirstSaleNote` prop passed to `PlanCard`.

**Verification**: PricingPage renders cleanly for both logged-in and anonymous users.

### Task 4: UpgradeModal — Remove hasFirstSale Prop
**File**: `src/features/billing/components/UpgradeModal.tsx`

Remove `hasFirstSale` prop from the component interface and any conditional text that references it. Update all callers (BillingSettingsPage, PricingPage).

**Verification**: Upgrade modal shows correctly for plan changes.

### Task 5: CommunityPricingSettings — Add Billing Setup Gate
**File**: `src/features/community/components/CommunityPricingSettings.tsx`

When the component loads, check creator's billing status:
```typescript
const billing = await getCreatorBilling(profileId);
const connectStatus = await getConnectAccountStatus(profileId);

const setupComplete =
  billing?.activation_fee_paid &&
  billing?.plan_id != null &&
  connectStatus?.status === 'active';
```

If `!setupComplete`:
- Disable pricing type selector (keep on 'free')
- Show inline message: "Complete your billing setup to enable paid communities"
- Link to `/settings?tab=billing`

If `setupComplete`:
- Pricing UI works as normal

**Verification**: Creator without complete setup cannot set prices. Creator with complete setup can.

### Task 6: Remove Student Plus
**Files to delete:**
- `supabase/functions/student-plus-checkout/index.ts`
- `supabase/functions/student-plus-portal/index.ts`

**Files to modify:**
- `src/App.tsx` — remove `/student-plus` route and `StudentPlusPage` import
- Find and remove any `StudentPlusPage` component file

**Verification**: Build succeeds. No references to student-plus in frontend code.

### Task 7: Remove Deprecated Wallet Edge Functions
**Files to delete:**
- `supabase/functions/release-pending-balances/index.ts`
- `supabase/functions/process-payouts/index.ts`
- `supabase/functions/creator-withdrawal/index.ts`

**Verification**: Build succeeds. These functions are already unused by frontend.

### Task 8: Clean Up stripeTypes.ts
**File**: `src/features/billing/stripeTypes.ts`

Remove any references to:
- `studentPlus` configuration
- Wallet/balance-related types that may remain
- `has_first_sale` / `monthly_fee_active` if they're in type definitions

**Verification**: Build succeeds with no unused type warnings.

## Files Summary

### Delete (7 files)
- `supabase/functions/student-plus-checkout/index.ts`
- `supabase/functions/student-plus-portal/index.ts`
- `supabase/functions/release-pending-balances/index.ts`
- `supabase/functions/process-payouts/index.ts`
- `supabase/functions/creator-withdrawal/index.ts`

### Modify (6 files)
- `src/features/billing/pages/BillingSettingsPage.tsx` — setup checklist, remove first-sale/trial UI
- `src/features/billing/pages/PricingPage.tsx` — remove first-sale references
- `src/features/billing/components/UpgradeModal.tsx` — remove hasFirstSale prop
- `src/features/community/components/CommunityPricingSettings.tsx` — add billing gate
- `src/features/billing/stripeTypes.ts` — cleanup
- `src/App.tsx` — remove student-plus route

### No changes needed
- Edge functions (already deployed with correct config)
- Database (no migrations needed)
- `stripeService.ts` (already cleaned up)

## Out of Scope
- Dashboard banner/nudge widget (can add later, billing settings checklist is sufficient for now)
- Onboarding wizard (current OnboardingPage for activation fee works fine)
- Community-checkout edge function (already uses STRIPE_SECRET_KEY from env, creates products dynamically)
