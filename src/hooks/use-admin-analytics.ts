import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { adminAnalyticsService } from '@/services/admin-analytics.service';

const QUERY_KEY = ['admin-analytics'];

export function useAdminAnalytics() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: adminAnalyticsService.getAnalytics,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const invalidate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }, [queryClient]);

    useEffect(() => {
        // Channel 1: Course-related tables
        const courseChannel = supabase
            .channel('admin-analytics-courses')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, invalidate)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'course_days' }, invalidate)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'course_lessons' }, invalidate)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'course_tasks' }, invalidate)
            .subscribe();

        // Channel 2: Roadmap-related tables
        const roadmapChannel = supabase
            .channel('admin-analytics-roadmap')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_tracks' }, invalidate)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_topics' }, invalidate)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_resources' }, invalidate)
            .subscribe();

        return () => {
            supabase.removeChannel(courseChannel);
            supabase.removeChannel(roadmapChannel);
        };
    }, [invalidate]);

    return query;
}
