/**
 * Generates deterministic social-proof numbers (rating + vote count)
 * from a course ID, and picks a subset of real community members as "voters."
 */

export interface CourseVoter {
  full_name: string;
  avatar_url: string | null;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCourseProof(courseId: string, members?: CourseVoter[]) {
  const h = hashCode(courseId);
  // Rating between 4.2 and 4.9 (one decimal)
  const rating = 4.2 + ((h % 8) / 10);
  // Vote count between 14 and 48
  const votes = 14 + (h % 35);

  // Pick a deterministic subset of real members as displayed voters
  let displayVoters: CourseVoter[] = [];
  if (members && members.length > 0) {
    const count = Math.min(3 + (h % 3), members.length); // 3-5 faces
    const sorted = [...members].sort(
      (a, b) => hashCode(courseId + a.full_name) - hashCode(courseId + b.full_name),
    );
    displayVoters = sorted.slice(0, count);
  }

  return { rating: Math.round(rating * 10) / 10, votes, displayVoters };
}
