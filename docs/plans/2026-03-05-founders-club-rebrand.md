# Founders Club Rebrand Plan

**Date**: 2026-03-05
**Status**: Approved
**Scope**: Full rebrand from "Founders Club" to "Founders Club"

## Decisions

| Decision | Choice |
|----------|--------|
| Brand name | "Founders Club" (no apostrophe, no TM) |
| Logo approach | Separate files per variant (no CSS filter hack) |
| Supabase | Same project — rebrand in place |
| Stripe | New account — just update code references |
| Domain/Vercel | Manual later — leave current config |
| Copyright year | 2026 |
| Platform metadata key | `founders_club` (was `creator_club`) |

## Section 1: Brand Assets & Logo Component

### Static Files (`public/`)

| Action | File | Source |
|--------|------|--------|
| Add | `public/logo-dark.png` | `foundericons/IMG_9240.PNG` (black on white) |
| Add | `public/logo-light.png` | `foundericons/IMG_9241.PNG` (white on black) |
| Replace | `public/favicon.png` | `foundericons/IMG_9246.PNG` (FC monogram) |
| Delete | `public/logo.png` | Old Founders Club logo |

### Logo Component (`src/shared/Logo.tsx`)

- Remove CSS `brightness(0) invert(1)` filter
- `variant='dark'` uses `/logo-dark.png`
- `variant='light'` uses `/logo-light.png`
- Alt text: "Founders Club"
- Display text: "Founders Club"

### index.html

- Title: `Founders Club | The All-in-One Creator OS`
- Meta description updated

## Section 2: i18n Translation Files

**Files**: `src/i18n/locales/en.json`, `src/i18n/locales/bg.json`

~26 occurrences each. All "Founders Club" text replaced with "Founders Club".

Key renames:
- Translation keys containing `creatorClub` renamed to `foundersClub`
- All component references to renamed keys updated
- Copyright years updated to 2026
- `"joinCreatorClub"` -> `"joinFoundersClub"`
- `"creatorClubOffers"` -> `"foundersClubOffers"`
- `"creatorClubReplaces"` -> `"foundersClubReplaces"`

## Section 3: Source Code (15 files)

### UI/Display strings
- `src/shared/Logo.tsx` — alt text, display text
- `src/public-pages/MarketingLandingPage.tsx` — brand mention
- `src/public-pages/WhopLandingPage.tsx` — brand mention
- `src/public-pages/auth/SignupForm.tsx` — "Join Founders Club"
- `src/public-pages/landing/VSLSection.tsx` — brand mentions
- `src/public-pages/landing/WaitlistSection.tsx` — brand mentions

### Service/logic files
- `src/features/billing/stripeService.ts` — comment
- `src/features/billing/stripeTypes.ts` — `platform: 'creator_club'` type + description
- `src/features/ai-manager/geminiService.ts` — AI system prompt
- `src/features/calendar/eventService.ts` — brand reference
- `src/core/contexts/CommunityContext.tsx` — brand reference

### Onboarding screens
- `src/features/creator-onboarding/components/SummaryScreen.tsx`
- `src/features/student-onboarding/components/StudentSummaryScreen.tsx`

## Section 4: Edge Functions (Supabase)

Same Supabase project — rebrand in place.

| File | Changes |
|------|---------|
| `supabase/functions/stripe-checkout/index.ts` | `platform: 'founders_club'` |
| `supabase/functions/stripe-connect/index.ts` | comment + `platform: 'founders_club'` |
| `supabase/functions/community-checkout/index.ts` | `founders_club_code_id` + `platform: 'founders_club'` |
| `supabase/functions/student-plus-checkout/index.ts` | `platform: 'founders_club'` |
| `supabase/functions/generate-weekly-report/index.ts` | AI system prompt |
| `supabase/functions/stripe-webhook/index.ts` | Check for references |

## Section 5: Documentation & Config

### Config files
- `package.json` — name: `"founders-club"`
- `metadata.json` — name: `"Founders Club"`, updated description
- `CLAUDE.md` — full rebrand (~11 occurrences)
- `README.md` — 3 occurrences

### Docs
- `docs/Founders Club v1.0.md` — rename to `docs/Founders Club v1.0.md` + update contents
- `docs/SETUP-STATUS.md` — update references
- `docs/QUICK_START.md`, `docs/AUTH_SETUP.md` — update references
- Various `docs/plans/` files — update references
- Migration SQL comments — cosmetic, update where found

### Test files
- `tests/manual-qa.spec.ts`, `tests/quick-qa.spec.ts` — brand references
- `playwright.config.ts` — leave `creator-planet.vercel.app` baseURL (domain change later)

## Manual Steps (User)

- [ ] Set up new custom domain and point to Vercel
- [ ] Create new Stripe account and configure products
- [ ] Update environment variables (Stripe keys)
- [ ] Update Vercel project name if desired
- [ ] Deploy edge functions to Supabase after rebrand
