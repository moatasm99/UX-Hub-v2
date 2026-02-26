import { supabase } from '@/lib/supabase';

export interface CourseTaskDTO {
    id: string;
    lesson_id: string;
    title: string;
    description: string | null;
    position: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateCourseTaskInput = Omit<CourseTaskDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCourseTaskInput = Partial<CreateCourseTaskInput> & { id: string };

export const courseTasksService = {
    getAll: async (lessonId: string) => {
        const { data, error } = await (supabase
            .from('course_tasks' as any) as any)
            .select('*')
            .eq('lesson_id', lessonId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseTaskDTO[];
    },

    create: async (input: CreateCourseTaskInput) => {
        const { data, error } = await (supabase
            .from('course_tasks' as any) as any)
            .insert(input)
            .select()
            .single();
        if (error) throw error;
        return data as CourseTaskDTO;
    },

    update: async ({ id, ...updates }: UpdateCourseTaskInput) => {
        const { data, error } = await (supabase
            .from('course_tasks' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseTaskDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('course_tasks' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
