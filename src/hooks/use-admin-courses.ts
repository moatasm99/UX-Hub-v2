import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCoursesService, type CreateCourseInput, type UpdateCourseInput } from '../services/admin-courses';

export function useAdminCourses() {
    const queryClient = useQueryClient();

    // Query: Get all courses
    const coursesQuery = useQuery({
        queryKey: ['admin-courses'],
        queryFn: adminCoursesService.getAll,
    });

    // Mutation: Create course
    const createCourse = useMutation({
        mutationFn: (newCourse: CreateCourseInput) => adminCoursesService.create(newCourse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
        },
    });

    // Mutation: Update course
    const updateCourse = useMutation({
        mutationFn: (updates: UpdateCourseInput) => adminCoursesService.update(updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
        },
    });

    // Mutation: Delete course
    const deleteCourse = useMutation({
        mutationFn: (id: string) => adminCoursesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
        },
    });

    return {
        courses: coursesQuery.data ?? [],
        isLoading: coursesQuery.isLoading,
        isError: coursesQuery.isError,
        error: coursesQuery.error,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}
