/**
 * Course Query Hooks
 *
 * React Query hooks for courses — the ONLY way UI should access course data.
 */

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import {
    getCourses,
    getCourseById,
    getCourseCategories,
    getCoursesByCategory,
} from '@/services/courses'
import type { CourseType } from '@/types/database'

export function useCourses(type?: CourseType) {
    return useQuery({
        queryKey: type ? queryKeys.courses.list(type) : queryKeys.courses.all,
        queryFn: () => getCourses(type),
    })
}

export function useCourse(id: string) {
    return useQuery({
        queryKey: queryKeys.courses.detail(id),
        queryFn: () => getCourseById(id),
        enabled: !!id,
    })
}

export function useCourseCategories() {
    return useQuery({
        queryKey: [...queryKeys.courses.all, 'categories'],
        queryFn: getCourseCategories,
    })
}

export function useCoursesByCategory(category: string) {
    return useQuery({
        queryKey: [...queryKeys.courses.all, 'byCategory', category],
        queryFn: () => getCoursesByCategory(category),
        enabled: !!category,
    })
}
