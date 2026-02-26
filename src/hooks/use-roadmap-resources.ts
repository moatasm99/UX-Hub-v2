import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    roadmapResourcesService,
    type CreateRoadmapResourceInput,
    type UpdateRoadmapResourceInput,
} from '../services/roadmap-resources';

export function useRoadmapResources(topicId: string) {
    const queryClient = useQueryClient();

    const resourcesQuery = useQuery({
        queryKey: ['admin-roadmap-resources', topicId],
        queryFn: () => roadmapResourcesService.getByTopic(topicId),
        enabled: !!topicId,
    });

    const createResource = useMutation({
        mutationFn: (input: CreateRoadmapResourceInput) => roadmapResourcesService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-resources', topicId] });
        },
    });

    const updateResource = useMutation({
        mutationFn: (input: UpdateRoadmapResourceInput) => roadmapResourcesService.update(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-resources', topicId] });
        },
    });

    const deleteResource = useMutation({
        mutationFn: (id: string) => roadmapResourcesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-resources', topicId] });
        },
    });

    return {
        resources: resourcesQuery.data ?? [],
        isLoading: resourcesQuery.isLoading,
        isError: resourcesQuery.isError,
        error: resourcesQuery.error,
        createResource,
        updateResource,
        deleteResource,
    };
}
