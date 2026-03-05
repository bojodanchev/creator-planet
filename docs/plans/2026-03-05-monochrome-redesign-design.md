# Founders Club - Monochrome Redesign

**Date**: 2026-03-05
**Status**: Approved
**Direction**: Pure black & white, dark-mode dominant, neo-grotesque typography

---

## 1. Design Principles

- **Pure monochrome** — no accent color. The entire UI lives in black, white, and gray.
- **Borders over shadows** — containers defined by fine `1px` borders, never box-shadows.
- **Semantic color only** — red, green, amber used strictly for functional status (errors, success, warnings). Nothing decorative.
- **Precision motion** — fast, crisp transitions (150ms). No bounce, no elastic, no glow.
- **Typography-driven hierarchy** — size, weight, and luminance create structure, not color.

---

## 2. Color Palette

### Core Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--black` | `#000000` | Deepest backgrounds (page-level) |
| `--bg-primary` | `#0A0A0A` | Main app background, card backgrounds |
| `--border-default` | `#1F1F1F` | Card/container borders, dividers |
| `--border-hover` | `#333333` | Hover state borders |
| `--border-active` | `#555555` | Active/focused borders |
| `--surface-hover` | `#151515` | Hover background on interactive elements |
| `--surface-active` | `#1A1A1A` | Active/pressed backgrounds |
| `--text-primary` | `#FAFAFA` | Headings, primary text, key data |
| `--text-secondary` | `#A0A0A0` | Descriptions, labels, body text |
| `--text-tertiary` | `#666666` | Placeholders, disabled, captions |
| `--white` | `#FFFFFF` | Inverted buttons, strong emphasis |

### Semantic Status Colors (functional only)

| Token | Hex | Usage |
|-------|-----|-------|
| `--status-danger` | `#EF4444` | At-risk, errors, destructive actions |
| `--status-success` | `#22C55E` | Completion, success states |
| `--status-warning` | `#EAB308` | Warnings, attention needed |

### Tailwind Mapping

These tokens map to Tailwind utility classes used throughout the app:

| Token | Tailwind Background | Tailwind Text | Tailwind Border |
|-------|---------------------|---------------|-----------------|
| `--bg-primary` | `bg-[#0A0A0A]` | — | — |
| `--border-default` | — | — | `border-[#1F1F1F]` |
| `--border-hover` | — | — | `border-[#333333]` |
| `--border-active` | — | — | `border-[#555555]` |
| `--surface-hover` | `bg-[#151515]` | — | — |
| `--surface-active` | `bg-[#1A1A1A]` | — | — |
| `--text-primary` | — | `text-[#FAFAFA]` | — |
| `--text-secondary` | — | `text-[#A0A0A0]` | — |
| `--text-tertiary` | — | `text-[#666666]` | — |

---

## 3. Typography

### Font

**Primary**: Aeonik (commercial) or **Switzer** (free, Fontshare)
**Fallback**: system-ui, -apple-system, sans-serif

Replace current Inter import in `index.html` with chosen font.

### Scale

| Level | Size | Weight | Color Token |
|-------|------|--------|-------------|
| Page title | `text-2xl` (24px) | Semibold (600) | `--text-primary` |
| Section heading | `text-lg` (18px) | Medium (500) | `--text-primary` |
| Card title | `text-base` (16px) | Medium (500) | `--text-primary` |
| Body text | `text-sm` (14px) | Regular (400) | `--text-secondary` |
| Label / caption | `text-xs` (12px) | Medium (500) | `--text-tertiary` |
| Stat numbers | `text-3xl` (30px) | Bold (700) | `--text-primary` |

---

## 4. Component System

### Cards

- Background: `#0A0A0A` (same as page — defined by border, not fill)
- Border: `1px solid #1F1F1F`
- Border radius: `12px` (`rounded-xl`)
- Hover (interactive): border `#333333`, bg `#151515`
- No box-shadows anywhere

### Buttons

| Type | Background | Text | Border | Hover |
|------|-----------|------|--------|-------|
| **Primary** | `#FFFFFF` | `#000000` | none | `#E0E0E0` bg |
| **Secondary** | transparent | `#FAFAFA` | `#1F1F1F` | `#151515` bg, `#333` border |
| **Ghost** | transparent | `#A0A0A0` | none | `#FAFAFA` text, `#151515` bg |
| **Destructive** | transparent | `#EF4444` | none | `#EF4444` bg at 10% opacity |

All buttons: `rounded-lg`, `text-sm`, `font-medium`, `150ms ease` transitions.

### Form Inputs

- Background: `#0A0A0A`
- Border: `1px solid #1F1F1F`
- Text: `#FAFAFA`
- Placeholder: `#666666`
- Focus: border `#555555`, ring `ring-1 ring-white/10`
- Labels: `text-xs`, `#A0A0A0`, `font-medium`, uppercase tracking

### Dropdowns

- Trigger: same as input styling
- Panel: `#0A0A0A` bg, `#1F1F1F` border
- Option hover: `#151515` bg
- Selected option: `#FAFAFA` text with white check icon

### Toggles & Checkboxes

- Off: `#1F1F1F` bg, `#333` border
- On: `#FFFFFF` bg, black check/dot (inverted)

### Badges & Status Pills

| Status | Text Color | Background |
|--------|-----------|------------|
| Success / Active | `#22C55E` | `#22C55E` at 10% opacity |
| At Risk / Error | `#EF4444` | `#EF4444` at 10% opacity |
| Warning | `#EAB308` | `#EAB308` at 10% opacity |
| Neutral / Default | `#A0A0A0` | `#1F1F1F` |

---

## 5. Interactive States

Context-appropriate patterns (not one-size-fits-all):

### Sidebar Navigation
- **Default**: `#A0A0A0` text, no background
- **Hover**: `#FAFAFA` text, `#151515` background
- **Active**: `#FAFAFA` text, `#151515` background, `2px` white left bar

### Tabs (Settings, etc.)
- **Default**: `#A0A0A0` text
- **Hover**: `#FAFAFA` text
- **Active**: `#FAFAFA` text, `2px` white bottom border

### Table Rows
- **Hover**: `#151515` background

### Cards (clickable)
- **Hover**: border `#333333`, background `#151515`

---

## 6. App Shell

### Sidebar
- Background: `#0A0A0A`
- Right border: `1px solid #1F1F1F`
- Logo: white variant
- Community switcher: `#1F1F1F` border card, `#333` circle for community initial
- Team role colors: replaced with `#A0A0A0` uniform text (no more indigo/emerald/amber per role)
- Profile section: `#1F1F1F` top border, avatar with `#333` border
- Sign out: `#A0A0A0` default, `#EF4444` on hover

### Mobile Header
- Background: `#0A0A0A`, bottom border `#1F1F1F`
- White hamburger icon, centered logo

### Content Area
- Background: `#0A0A0A`
- Page titles: `text-2xl`, semibold, `#FAFAFA`
- Page descriptions: `text-sm`, `#A0A0A0`

### Loading Screen
- `#0A0A0A` background
- White spinner ring
- `#A0A0A0` loading text

---

## 7. Feature Screens

### Dashboard
- Stat cards: `#1F1F1F` border, icon on `#1F1F1F` rounded square with white icon
- Charts: `#1F1F1F` grid lines, white line/area stroke, 5% white fill gradient
- Chart tooltip: `#151515` bg, `#1F1F1F` border
- Positive/negative changes: `#22C55E` / `#EF4444` (semantic only)

### Community Hub
- Channel list: `#1F1F1F` right border, active channel has white left bar + `#151515` bg
- Post cards: `#1F1F1F` border, author `#FAFAFA`, timestamp `#666666`
- Post content: `#A0A0A0`
- Interaction icons (like/reply): `#666666` default, `#FAFAFA` hover

### Course LMS
- Course cards: `#1F1F1F` border
- Progress bars: `#1F1F1F` track, `#FFFFFF` fill
- Module accordion: `#1F1F1F` borders, `#666666` chevron
- Active lesson: `#FAFAFA` text, white left bar
- Completion checks: `#22C55E` (semantic)

### Calendar
- Grid borders: `#1F1F1F`
- Today: white circle behind date number
- Events: white fill blocks
- Event popover: `#151515` bg, `#1F1F1F` border

### AI Chat
- AI messages: `#151515` bg, `#1F1F1F` border, `#A0A0A0` text
- User messages: `#FAFAFA` bg, `#000000` text (inverted — the bright moment)
- Input: standard form input
- Typing indicator: three pulsing white dots

### Settings
- Tabs: `#A0A0A0` default, `#FAFAFA` active + white bottom border
- Sections: separated by `#1F1F1F` horizontal rules
- Save: white primary button

### Billing
- Plan cards: `#1F1F1F` border, current plan `#333` border + white "Current" badge
- Prices: `#FAFAFA`, `text-3xl`, bold

---

## 8. Motion & Transitions

### Timing

| Element | Duration | Easing |
|---------|----------|--------|
| Button/card hover | `150ms` | `ease` |
| Sidebar nav hover | `150ms` | `ease` |
| Page transitions | `200ms` | `ease-out` |
| Modals (fade + backdrop) | `200ms` | `ease-out` |
| Dropdowns (scale + fade) | `150ms` | `ease-out` |
| Loading spinner | `1s` | `linear infinite` |
| Toast slide-in | `250ms` | `ease-out` |

### Page Enter Animation

```css
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Removals

- All `shadow-*` classes (no shadows in the design)
- All `shadow-indigo-500/30` glow effects
- `animate-shake` animation
- Global `* { transition-timing-function }` rule (too aggressive)
- All colored backgrounds on icon containers (`bg-indigo-*`, `bg-emerald-*`, etc.)

---

## 9. Migration Strategy

### Phase 1: Foundation
1. Replace Inter font with Switzer/Aeonik in `index.html`
2. Update `index.css` — remove shake animation, update global transitions
3. Create CSS custom properties for the token palette

### Phase 2: App Shell
4. Refactor `Sidebar.tsx` — replace all slate/indigo classes
5. Update `App.tsx` loading screen
6. Update mobile header

### Phase 3: Shared Components
7. Update button patterns across the app
8. Update form inputs, dropdowns, toggles
9. Update card patterns, badges, status pills
10. Update modals (`ConfirmModal`, etc.)

### Phase 4: Feature Screens
11. Dashboard — stat cards, charts, tables
12. Community Hub — channels, posts, composer
13. Course LMS — course cards, progress, quiz UI
14. Calendar — grid, events, popovers
15. AI Chat — message bubbles, input
16. Settings — tabs, sections, forms
17. Billing — plan cards, balance display

### Phase 5: Public Pages
18. Landing pages (LandingPage, MarketingLandingPage, WhopLandingPage)
19. Auth pages (login, signup, reset password)
20. Community landing page, directory
21. Onboarding flows

---

## 10. Files Requiring Changes

### Critical (app-wide impact)
- `index.html` — font import
- `index.css` — animations, global styles
- `src/App.tsx` — loading screen, layout wrapper
- `src/shared/Sidebar.tsx` — full color replacement
- `src/shared/CommunitySwitcher.tsx` — color replacement
- `src/shared/ConfirmModal.tsx` — modal styling
- `src/shared/Avatar.tsx` — border colors
- `src/shared/Logo.tsx` — ensure white variant works

### Feature screens (~20 files)
- `src/features/dashboard/Dashboard.tsx`
- `src/features/community/CommunityHub.tsx`
- `src/features/courses/CourseLMS.tsx`
- `src/features/calendar/CalendarView.tsx`
- `src/features/ai-manager/AiSuccessManager.tsx`
- `src/features/settings/Settings.tsx`
- `src/features/billing/` (multiple components)
- `src/features/homework/HomeworkPage.tsx`
- `src/features/chatbots/ChatbotsPage.tsx`
- `src/features/student-manager/` components
- `src/features/discounts/DiscountsPage.tsx`
- `src/features/surveys/` components
- `src/features/team/` components
- `src/features/direct-messages/` components

### Public pages (~10 files)
- `src/public-pages/LandingPage.tsx`
- `src/public-pages/MarketingLandingPage.tsx`
- `src/public-pages/WhopLandingPage.tsx`
- `src/public-pages/communities/CommunityLandingPage.tsx`
- `src/public-pages/communities/CommunitiesDirectory.tsx`
- `src/public-pages/auth/LoginForm.tsx`
- `src/public-pages/auth/SignupForm.tsx`
- `src/public-pages/invite/TeamInvitePage.tsx`
- `src/features/billing/pages/TBIStatusPage.tsx`

### UI components
- `src/components/ui/AiResponseText.tsx`
- `src/shared/LanguageSwitcher.tsx`
- Any other shared UI components discovered during implementation
