import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    roadmapTopicsService,
    type CreateRoadmapTopicInput,
    type UpdateRoadmapTopicInput,
} from '../services/roadmap-topics';

export function useRoadmapTopics(trackId: string) {
    const queryClient = useQueryClient();

    const topicsQuery = useQuery({
        queryKey: ['admin-roadmap-topics', trackId],
        queryFn: () => roadmapTopicsService.getByTrack(trackId),
        enabled: !!trackId,
    });

    const createTopic = useMutation({
        mutationFn: (input: CreateRoadmapTopicInput) => roadmapTopicsService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-topics', trackId] });
        },
    });

    const updateTopic = useMutation({
        mutationFn: (input: UpdateRoadmapTopicInput) => roadmapTopicsService.update(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-topics', trackId] });
        },
    });

    const deleteTopic = useMutation({
        mutationFn: (id: string) => roadmapTopicsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-topics', trackId] });
        },
    });

    return {
        topics: topicsQuery.data ?? [],
        isLoading: topicsQuery.isLoading,
        isError: topicsQuery.isError,
        error: topicsQuery.error,
        createTopic,
        updateTopic,
        deleteTopic,
    };
}

