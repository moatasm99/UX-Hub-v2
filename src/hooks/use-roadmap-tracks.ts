import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    roadmapTracksService,
    type CreateRoadmapTrackInput,
    type UpdateRoadmapTrackInput,
} from '@/services/roadmap-tracks';

export function useRoadmapTracks() {
    const qc = useQueryClient();
    const key = ['roadmap-tracks'];

    const query = useQuery({ queryKey: key, queryFn: roadmapTracksService.getAll });

    const create = useMutation({
        mutationFn: (input: CreateRoadmapTrackInput) => roadmapTracksService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateRoadmapTrackInput) => roadmapTracksService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => roadmapTracksService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        tracks: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        create,
        update,
        remove,
    };
}
