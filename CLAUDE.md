# Founders Club

All-in-one platform for mentors, coaches, and course creators. Replaces Discord+Kajabi+Calendly+Skool+Zapier. (React 19 + TypeScript + Vite + Supabase + Stripe + Gemini AI)

## Quick Start
```bash
npm install && npm run dev   # Dev server
npm run build                # Production build
```

## Key Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npx supabase functions deploy <name>` | Deploy edge function |
| `npx supabase functions deploy <name> --no-verify-jwt` | Deploy webhook receiver |

## Project Structure
> Deep dive: [docs/architecture.md](docs/architecture.md)

```
src/features/    # Feature modules (billing, courses, community, team, etc.)
src/shared/      # Reusable UI (Avatar, Logo, Sidebar)
src/core/        # Types, Supabase client
src/i18n/        # en.json + bg.json (default: Bulgarian)
supabase/functions/  # Edge functions with _shared/ utilities
```

## Architecture Pointers
> Deep dive: [docs/architecture.md](docs/architecture.md)

- **Feature modules**: `src/features/<name>/` with components/, hooks/, pages/
- **Profile ID ≠ User ID**: ALL FKs reference `profiles.id`, NOT `auth.users.id` — use `profile.id` from `useAuth()`
- **Billing**: Destination charges — Stripe splits payments automatically, platform takes fee via `application_fee_amount` → [docs/billing.md](docs/billing.md)
- **i18n**: All text via `t('key')`. Verify BOTH `en.json` + `bg.json` after UI changes
- **Edge functions**: Deploy via CLI (MCP can't resolve `_shared/` imports)

## Environment & MCP
> Details: [docs/environment.md](docs/environment.md) | [docs/mcp-config.md](docs/mcp-config.md)

- **Supabase**: `ilntxxutxbygjuixrzng` (FC) — MCP has service_role access
- **Stripe**: European Fashion Institute (`acct_1Sra05HH4asvT4B6`) — MCP via OAuth, products created
- **Vercel**: Production at https://founderclub.bg — auto-deploys from `main` on GitHub push. Test changes there, not localhost.
- **DB direct access**: Use CLI pooler from `supabase db dump --dry-run`, then `SET ROLE postgres`

## Rules & Style
- TypeScript strict mode, `import type` for type-only imports
- Use `??` never `||` for numeric fallbacks (falsy zero bug)
- RLS policies: ALWAYS include `TO authenticated` or `TO anon`
- Webhook functions: ALWAYS deploy with `--no-verify-jwt`
- Currency: Always integer cents in DB (€30 = 3000)
- i18n plurals: `_one`/`_other` suffixes (i18next v21+)

## Gotchas (Top 5)
> Full list: [docs/gotchas.md](docs/gotchas.md)

1. **Profile ID vs User ID** — `profile.id` for DB ops, never `user.id`
2. **RLS `TO` clause** — omitting defaults to `PUBLIC` which authenticated users can't use
3. **`||` vs `??`** — `0 || fallback` silently returns fallback (broke Exclusive plan fees)
4. **Edge function `--no-verify-jwt`** — webhooks get 401 at gateway without it
5. **i18n both locales** — missing keys in bg.json shows raw key text to Bulgarian users

## Skills
Custom skills in `.claude/skills/`: billing-integration, stripe-integration, stripe-webhooks, stripe-best-practices

## Recent Decisions
> History: [docs/decisions/](docs/decisions/)

- [2026-03-09] Wallet → Destination charges — Stripe manages all money, platform never holds funds

## Discovery Log (Recent)
> Full log: [docs/discovery-log.md](docs/discovery-log.md)

- [2026-03-09] Stripe wired to European Fashion Institute account — products, webhook, env vars, simplified billing
- [2026-03-09] Full CC → FC schema sync complete (72 tables, 76 functions, 257 policies, 7 buckets)
- [2026-03-05] CC → FC data migration (20 tables, 131 users/profiles imported)

## Active Context
Stripe fully wired on European Fashion Institute account. Billing simplified to destination charges (no wallet). Edge functions deployed. Still missing from CC: modules, lessons, events, event_attendees, lesson_progress, quiz_attempts. Storage files (~11.2GB) remain on CC public URLs. Deprecated wallet tables remain in schema (can drop later).
