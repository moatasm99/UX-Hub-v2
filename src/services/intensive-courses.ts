import { supabase } from '@/lib/supabase';

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export interface IntensiveCourseDTO {
    id: string;
    category_id: string;
    title: string;
    slug: string;
    short_description: string | null;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
    badge_label: string | null;
    badge_color: string | null;
    icon_key: string | null;
    icon_bg_color: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateIntensiveCourseInput = Omit<IntensiveCourseDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateIntensiveCourseInput = Partial<CreateIntensiveCourseInput> & { id: string };

export const intensiveCoursesService = {
    getPublished: async (categoryId: string) => {
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as IntensiveCourseDTO[];
    },

    getBySlug: async (slug: string) => {
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) throw error;
        return data as IntensiveCourseDTO;
    },

    getAll: async (categoryId: string) => {
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .select('*')
            .eq('category_id', categoryId)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as IntensiveCourseDTO[];
    },

    getById: async (id: string) => {
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data as IntensiveCourseDTO;
    },

    generateUniqueSlug: async (title: string, excludeId?: string): Promise<string> => {
        const base = slugify(title);
        let candidate = base;
        let suffix = 1;
        while (true) {
            const query = (supabase.from('courses' as any) as any)
                .select('id').eq('slug', candidate).limit(1);
            const { data } = excludeId ? await query.neq('id', excludeId) : await query;
            if (!data || data.length === 0) return candidate;
            candidate = `${base}-${suffix}`;
            suffix++;
        }
    },

    create: async (input: CreateIntensiveCourseInput) => {
        const slug = await intensiveCoursesService.generateUniqueSlug(input.title);
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .insert({ ...input, slug })
            .select()
            .single();
        if (error) throw error;
        return data as IntensiveCourseDTO;
    },

    update: async ({ id, ...updates }: UpdateIntensiveCourseInput) => {
        if (updates.title) {
            updates.slug = await intensiveCoursesService.generateUniqueSlug(updates.title, id);
        }
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as IntensiveCourseDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('courses' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
