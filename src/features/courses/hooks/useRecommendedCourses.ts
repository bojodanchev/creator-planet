import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../core/supabase/client';

export interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  creator_name: string;
  creator_avatar: string | null;
  enrollment_count: number;
  score: number;
}

export function useRecommendedCourses(profileId: string | undefined) {
  return useQuery<RecommendedCourse[]>({
    queryKey: ['courses', 'recommended', profileId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_recommended_courses', {
        p_profile_id: profileId!,
      });
      if (error) throw error;
      return (data ?? []) as RecommendedCourse[];
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  });
}
