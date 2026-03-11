-- Personalized course recommendations function
-- Scoring: community overlap (+10) + popularity (min(enrollments, 5)) - excludes enrolled courses
-- Fallback: returns most popular unenrolled courses when no community signal

CREATE OR REPLACE FUNCTION public.get_recommended_courses(p_profile_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  creator_name TEXT,
  creator_avatar TEXT,
  enrollment_count BIGINT,
  score BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH user_communities AS (
    SELECT community_id
    FROM memberships
    WHERE user_id = p_profile_id
  ),
  user_enrollments AS (
    SELECT course_id
    FROM enrollments
    WHERE user_id = p_profile_id
  ),
  course_enrollment_counts AS (
    SELECT course_id, COUNT(*) AS cnt
    FROM enrollments
    GROUP BY course_id
  ),
  scored_courses AS (
    SELECT
      c.id,
      c.title,
      c.description,
      c.thumbnail_url,
      p.full_name AS creator_name,
      p.avatar_url AS creator_avatar,
      COALESCE(ec.cnt, 0) AS enrollment_count,
      (
        CASE WHEN c.community_id IN (SELECT community_id FROM user_communities) THEN 10 ELSE 0 END
        + LEAST(COALESCE(ec.cnt, 0), 5)
      ) AS score
    FROM courses c
    JOIN profiles p ON p.id = c.creator_id
    LEFT JOIN course_enrollment_counts ec ON ec.course_id = c.id
    WHERE c.is_published = true
      AND c.id NOT IN (SELECT course_id FROM user_enrollments)
    ORDER BY score DESC, c.created_at DESC
    LIMIT 6
  )
  SELECT * FROM scored_courses;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_recommended_courses(UUID) TO authenticated;
