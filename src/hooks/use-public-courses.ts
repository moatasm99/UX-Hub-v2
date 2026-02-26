import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { courseCategoriesService } from '@/services/course-categories';
import { intensiveCoursesService } from '@/services/intensive-courses';
import { courseDaysService } from '@/services/course-days';
import { courseLessonsService } from '@/services/course-lessons';
import { courseTasksService } from '@/services/course-tasks';

const STALE_TIME = 1000 * 30; // 30 seconds

// ─── Published Categories ──────────────────────
export function usePublishedCategories() {
    const query = useQuery({
        queryKey: ['public-course-categories'],
        queryFn: () => courseCategoriesService.getPublished(),
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        const channel = supabase
            .channel('course-categories-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'course_categories' },
                refetch
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [refetch]);

    return { categories: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Published Courses for a Category ──────────
export function usePublishedCourses(categoryId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-courses', categoryId],
        queryFn: () => intensiveCoursesService.getPublished(categoryId!),
        enabled: !!categoryId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!categoryId) return;
        const channel = supabase
            .channel(`courses-realtime-${categoryId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'courses' },
                (payload: any) => {
                    if (payload.new?.category_id === categoryId || payload.old?.category_id === categoryId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [categoryId, refetch]);

    return { courses: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Course by Slug ────────────────────────────
export function useCourseBySlug(slug: string | undefined) {
    const query = useQuery({
        queryKey: ['public-course-slug', slug],
        queryFn: () => intensiveCoursesService.getBySlug(slug!),
        enabled: !!slug,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!slug) return;
        const channel = supabase
            .channel(`course-by-slug-${slug}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'courses' },
                (payload: any) => {
                    if (payload.new?.slug === slug || payload.old?.slug === slug) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [slug, refetch]);

    return { course: query.data ?? null, isLoading: query.isLoading, isError: query.isError };
}

// ─── Published Days for a Course ───────────────
export function usePublishedCourseDays(courseId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-course-days', courseId],
        queryFn: () => courseDaysService.getPublished(courseId!),
        enabled: !!courseId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!courseId) return;
        const channel = supabase
            .channel(`course-days-realtime-${courseId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'course_days' },
                (payload: any) => {
                    if (payload.new?.course_id === courseId || payload.old?.course_id === courseId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [courseId, refetch]);

    return { days: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Lessons for a Day ─────────────────────────
export function useCourseLessonsForDay(dayId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-course-lessons', dayId],
        queryFn: () => courseLessonsService.getAll(dayId!),
        enabled: !!dayId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!dayId) return;
        const channel = supabase
            .channel(`course-lessons-realtime-${dayId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'course_lessons' },
                (payload: any) => {
                    if (payload.new?.day_id === dayId || payload.old?.day_id === dayId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [dayId, refetch]);

    return { lessons: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

// ─── Tasks for a Lesson ────────────────────────
export function useCourseTasksForLesson(lessonId: string | undefined) {
    const query = useQuery({
        queryKey: ['public-course-tasks', lessonId],
        queryFn: () => courseTasksService.getAll(lessonId!),
        enabled: !!lessonId,
        staleTime: STALE_TIME,
    });

    const refetch = useCallback(() => { query.refetch(); }, [query.refetch]);

    useEffect(() => {
        if (!lessonId) return;
        const channel = supabase
            .channel(`course-tasks-realtime-${lessonId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'course_tasks' },
                (payload: any) => {
                    if (payload.new?.lesson_id === lessonId || payload.old?.lesson_id === lessonId) {
                        refetch();
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [lessonId, refetch]);

    return { tasks: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}
