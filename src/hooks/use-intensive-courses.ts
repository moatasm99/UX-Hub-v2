import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    intensiveCoursesService,
    type CreateIntensiveCourseInput,
    type UpdateIntensiveCourseInput,
} from '@/services/intensive-courses';

export function useIntensiveCourses(categoryId: string) {
    const qc = useQueryClient();
    const key = ['intensive-courses', categoryId];

    const query = useQuery({
        queryKey: key,
        queryFn: () => intensiveCoursesService.getAll(categoryId),
        enabled: !!categoryId,
    });

    const create = useMutation({
        mutationFn: (input: CreateIntensiveCourseInput) => intensiveCoursesService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateIntensiveCourseInput) => intensiveCoursesService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => intensiveCoursesService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        courses: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        create,
        update,
        remove,
    };
}

export function useCourseById(courseId: string | undefined) {
    const query = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => intensiveCoursesService.getById(courseId!),
        enabled: !!courseId,
    });

    return {
        course: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
