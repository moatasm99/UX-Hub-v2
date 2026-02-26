import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    courseLessonsService,
    type CreateCourseLessonInput,
    type UpdateCourseLessonInput,
} from '@/services/course-lessons';

export function useCourseLessons(dayId: string) {
    const qc = useQueryClient();
    const key = ['course-lessons', dayId];

    const query = useQuery({
        queryKey: key,
        queryFn: () => courseLessonsService.getAll(dayId),
        enabled: !!dayId,
    });

    const create = useMutation({
        mutationFn: (input: CreateCourseLessonInput) => courseLessonsService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateCourseLessonInput) => courseLessonsService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => courseLessonsService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        lessons: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        create,
        update,
        remove,
    };
}
