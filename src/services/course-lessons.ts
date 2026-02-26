import { supabase } from '@/lib/supabase';

export interface CourseLessonDTO {
    id: string;
    day_id: string;
    title: string;
    url: string;
    type: 'Video' | 'Article';
    duration: string | null;
    position: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateCourseLessonInput = Omit<CourseLessonDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCourseLessonInput = Partial<CreateCourseLessonInput> & { id: string };

export const courseLessonsService = {
    getAll: async (dayId: string) => {
        const { data, error } = await (supabase
            .from('course_lessons' as any) as any)
            .select('*')
            .eq('day_id', dayId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseLessonDTO[];
    },

    create: async (input: CreateCourseLessonInput) => {
        const { data, error } = await (supabase
            .from('course_lessons' as any) as any)
            .insert(input)
            .select()
            .single();
        if (error) throw error;
        return data as CourseLessonDTO;
    },

    update: async ({ id, ...updates }: UpdateCourseLessonInput) => {
        const { data, error } = await (supabase
            .from('course_lessons' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseLessonDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('course_lessons' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
