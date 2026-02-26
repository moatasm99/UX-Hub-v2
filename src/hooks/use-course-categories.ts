import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    courseCategoriesService,
    type CreateCourseCategoryInput,
    type UpdateCourseCategoryInput,
} from '@/services/course-categories';

export function useCourseCategories() {
    const qc = useQueryClient();
    const key = ['course-categories'];

    const query = useQuery({ queryKey: key, queryFn: courseCategoriesService.getAll });

    const create = useMutation({
        mutationFn: (input: CreateCourseCategoryInput) => courseCategoriesService.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: (input: UpdateCourseCategoryInput) => courseCategoriesService.update(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => courseCategoriesService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });

    return {
        categories: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        create,
        update,
        remove,
    };
}
