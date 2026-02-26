import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { roadmapTracksService } from '@/services/roadmap-tracks';
import { roadmapTopicsService } from '@/services/roadmap-topics';
import { roadmapResourcesService } from '@/services/roadmap-resources';

const STALE_TIME = 1000 * 30; // 30 seconds

// ─── Published Tracks ──────────────────────────
export function usePublishedTracks() {
    const query = useQuery({
        queryKey: ['public-roadmap-tracks'],
        queryFn: () => roadmapTracksService.getPublished(),
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        const channel = supabase
            .channel('roadmap-tracks-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'roadmap_tracks' },
                refetch
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [refetch]);

    return { tracks: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Published Topics for a Track ──────────────
export function usePublishedTopics(trackId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-roadmap-topics', trackId],
        queryFn: () => roadmapTopicsService.getPublishedByTrack(trackId!),
        enabled: !!trackId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!trackId) return;
        const channel = supabase
            .channel(`roadmap-topics-realtime-${trackId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'roadmap_topics' },
                (payload: any) => {
                    if (payload.new?.track_id === trackId || payload.old?.track_id === trackId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [trackId, refetch]);

    return { topics: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Published Resources for a Topic ───────────
export function usePublishedResources(topicId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-roadmap-resources', topicId],
        queryFn: () => roadmapResourcesService.getPublishedByTopic(topicId!),
        enabled: !!topicId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!topicId) return;
        const channel = supabase
            .channel(`roadmap-resources-realtime-${topicId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'roadmap_resources' },
                (payload: any) => {
                    if (payload.new?.topic_id === topicId || payload.old?.topic_id === topicId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [topicId, refetch]);

    return { resources: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}
