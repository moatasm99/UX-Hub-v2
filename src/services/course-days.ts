import { supabase } from '@/lib/supabase';

export interface CourseDayDTO {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    position: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateCourseDayInput = Omit<CourseDayDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCourseDayInput = Partial<CreateCourseDayInput> & { id: string };

export const courseDaysService = {
    getPublished: async (courseId: string) => {
        const { data, error } = await (supabase
            .from('course_days' as any) as any)
            .select('*')
            .eq('course_id', courseId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseDayDTO[];
    },

    getAll: async (courseId: string) => {
        const { data, error } = await (supabase
            .from('course_days' as any) as any)
            .select('*')
            .eq('course_id', courseId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseDayDTO[];
    },

    create: async (input: CreateCourseDayInput) => {
        const { data, error } = await (supabase
            .from('course_days' as any) as any)
            .insert(input)
            .select()
            .single();
        if (error) throw error;
        return data as CourseDayDTO;
    },

    update: async ({ id, ...updates }: UpdateCourseDayInput) => {
        const { data, error } = await (supabase
            .from('course_days' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseDayDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('course_days' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
