# Personalized Course Recommendations

**Date:** 2026-03-11
**Status:** Approved
**Surface:** Dashboard home ("Recommended for you")

## Problem

Users see the same generic course listing regardless of their activity, memberships, or interests. There's no personalized discovery — everything relies on manual browsing.

## Approach: Signal-Weighted Heuristic

Simple scoring formula computed entirely in Postgres. No AI, no external services. Designed to evolve as the platform grows.

### Scoring Signals

| Signal | Points | Logic |
|--------|--------|-------|
| Community overlap | +10 | Course belongs to a community the user is a member of |
| Popularity | +1 per enrollment (max 5) | Normalized enrollment count as tiebreaker |
| Already enrolled | Excluded | Never recommend courses the user already has |

### Fallback

When the user has no community memberships (or all community-linked courses are enrolled), the function naturally returns the most popular unenrolled courses. No special branch needed.

## Architecture

### 1. Postgres Function

`get_recommended_courses(p_profile_id UUID)` — SECURITY DEFINER

Returns up to 6 rows: `id, title, description, thumbnail_url, creator_name, creator_avatar, enrollment_count, score`

Ordered by `score DESC, created_at DESC`.

Single query joining `courses`, `memberships`, `enrollments`, `profiles` (for creator info).

### 2. React Hook

`useRecommendedCourses(profileId)` — calls `supabase.rpc('get_recommended_courses', { p_profile_id })`.

Returns `{ courses, loading, error }`.

### 3. Dashboard Component

`RecommendedCourses` — renders a horizontal row of up to 6 course cards.

**Card contents:** thumbnail, title, creator name + avatar, "X enrolled" count.

**States:**
- Loading: skeleton cards
- Data: course cards, click navigates to course detail
- Empty (no published courses at all): hide section entirely

**i18n:** Keys in both `en.json` and `bg.json`.

## Data Flow

```
Dashboard mounts
  → useRecommendedCourses(profileId)
    → supabase.rpc('get_recommended_courses', { p_profile_id })
    → Postgres:
        1. Get user's community IDs from memberships
        2. Score all published, unenrolled courses
        3. ORDER BY score DESC, created_at DESC
        4. LIMIT 6
    → Returns course array
  → RecommendedCourses renders cards
```

## Future Extensions

- **Category match** — boost courses in same categories as enrolled courses (once metadata lands)
- **Peer enrollment** — "users enrolled in X also enrolled in Y"
- **Gemini embeddings** — vector similarity on course descriptions when catalog grows
- **Multiple surfaces** — course detail page ("Students also enrolled in…"), explore page

## Pieces to Build

1. **Migration:** `get_recommended_courses` Postgres function (via Supabase MCP)
2. **Hook:** `useRecommendedCourses` in `src/features/courses/hooks/`
3. **Component:** `RecommendedCourses` in `src/features/dashboard/components/`
4. **i18n:** Add keys to both `en.json` and `bg.json`
