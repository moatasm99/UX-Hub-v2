import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    courseTasksService,
    type CreateCourseTaskInput,
    type UpdateCourseTaskInput,
} from '@/services/course-tasks';

export function useCourseTasks(lessonId: string) {
    const qc = useQueryClient();
    const key = ['course-tasks', lessonId];

    const query = useQuery({
        queryKey: key,
        queryFn: () => courseTasksService.getAll(lessonId),
        enabled: !!lessonId,
    });

    const create = useMutation({
        mutationFn: (input: CreateCourseTaskInput) => courseTasksService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateCourseTaskInput) => courseTasksService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => courseTasksService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        tasks: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        create,
        update,
        remove,
    };
}
