import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    roadmapCategoriesService,
    type CreateRoadmapCategoryInput,
    type UpdateRoadmapCategoryInput,
} from '../services/roadmap-categories';

export function useRoadmapCategories() {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ['admin-roadmap-categories'],
        queryFn: roadmapCategoriesService.getAll,
    });

    const createCategory = useMutation({
        mutationFn: (input: CreateRoadmapCategoryInput) => roadmapCategoriesService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-categories'] });
        },
    });

    const updateCategory = useMutation({
        mutationFn: (input: UpdateRoadmapCategoryInput) => roadmapCategoriesService.update(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-categories'] });
        },
    });

    const deleteCategory = useMutation({
        mutationFn: (id: string) => roadmapCategoriesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roadmap-categories'] });
        },
    });

    return {
        categories: categoriesQuery.data ?? [],
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError,
        error: categoriesQuery.error,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}
