import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    courseDaysService,
    type CreateCourseDayInput,
    type UpdateCourseDayInput,
} from '@/services/course-days';

export function useCourseDays(courseId: string) {
    const qc = useQueryClient();
    const key = ['course-days', courseId];

    const query = useQuery({
        queryKey: key,
        queryFn: () => courseDaysService.getAll(courseId),
        enabled: !!courseId,
    });

    const create = useMutation({
        mutationFn: (input: CreateCourseDayInput) => courseDaysService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateCourseDayInput) => courseDaysService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => courseDaysService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        days: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        create,
        update,
        remove,
    };
}
