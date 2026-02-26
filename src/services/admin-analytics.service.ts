import { supabase } from '@/lib/supabase';

interface CourseRow {
    id: string;
    is_published: boolean;
    level: string | null;
}

interface LessonRow {
    id: string;
    type: string | null;
}

export interface AdminAnalyticsData {
    totals: {
        courses: number;
        publishedCourses: number;
        draftCourses: number;
        courseDays: number;
        lessons: number;
        tasks: number;
        roadmapTracks: number;
        roadmapTopics: number;
        roadmapResources: number;
    };
    distributions: {
        levels: { name: string; value: number }[];
        publishedStatus: { name: string; value: number }[];
        lessonTypes: { name: string; value: number }[];
    };
}

export const adminAnalyticsService = {
    getAnalytics: async (): Promise<AdminAnalyticsData> => {
        // Fetch counts in parallel for efficiency
        const [
            courses,
            days,
            lessons,
            tasks,
            tracks,
            topics,
            resources
        ] = await Promise.all([
            supabase.from('courses').select('id, is_published, level'),
            supabase.from('course_days').select('id', { count: 'exact', head: true }),
            supabase.from('course_lessons').select('id, type'),
            supabase.from('course_tasks').select('id', { count: 'exact', head: true }),
            supabase.from('roadmap_tracks').select('id', { count: 'exact', head: true }),
            supabase.from('roadmap_topics').select('id', { count: 'exact', head: true }),
            supabase.from('roadmap_resources').select('id', { count: 'exact', head: true }),
        ]);

        if (courses.error) throw courses.error;
        if (days.error) throw days.error;
        if (lessons.error) throw lessons.error;
        if (tasks.error) throw tasks.error;
        if (tracks.error) throw tracks.error;
        if (topics.error) throw topics.error;
        if (resources.error) throw resources.error;

        const allCourses = (courses.data || []) as CourseRow[];
        const allLessons = (lessons.data || []) as LessonRow[];

        // Totals
        const totals = {
            courses: allCourses.length,
            publishedCourses: allCourses.filter(c => c.is_published).length,
            draftCourses: allCourses.filter(c => !c.is_published).length,
            courseDays: days.count || 0,
            lessons: allLessons.length,
            tasks: tasks.count || 0,
            roadmapTracks: tracks.count || 0,
            roadmapTopics: topics.count || 0,
            roadmapResources: resources.count || 0,
        };

        // Distributions
        const levels = allCourses.reduce((acc, curr) => {
            const level = curr.level || 'Unset';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const lessonTypes = allLessons.reduce((acc, curr) => {
            const type = curr.type || 'Other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totals,
            distributions: {
                levels: Object.entries(levels).map(([name, value]) => ({ name, value })),
                publishedStatus: [
                    { name: 'Published', value: totals.publishedCourses },
                    { name: 'Draft', value: totals.draftCourses },
                ],
                lessonTypes: Object.entries(lessonTypes).map(([name, value]) => ({ name, value })),
            },
        };
    },
};
