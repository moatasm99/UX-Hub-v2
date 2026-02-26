import { supabase } from '@/lib/supabase';

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export interface CourseCategoryDTO {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateCourseCategoryInput = Omit<CourseCategoryDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCourseCategoryInput = Partial<CreateCourseCategoryInput> & { id: string };

export const courseCategoriesService = {
    getPublished: async () => {
        const { data, error } = await (supabase
            .from('course_categories' as any) as any)
            .select('*')
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseCategoryDTO[];
    },

    getAll: async () => {
        const { data, error } = await (supabase
            .from('course_categories' as any) as any)
            .select('*')
            .order('position', { ascending: true });
        if (error) throw error;
        return data as CourseCategoryDTO[];
    },

    generateUniqueSlug: async (title: string, excludeId?: string): Promise<string> => {
        const base = slugify(title);
        let candidate = base;
        let suffix = 1;
        while (true) {
            const query = (supabase.from('course_categories' as any) as any)
                .select('id').eq('slug', candidate).limit(1);
            const { data } = excludeId ? await query.neq('id', excludeId) : await query;
            if (!data || data.length === 0) return candidate;
            candidate = `${base}-${suffix}`;
            suffix++;
        }
    },

    create: async (input: CreateCourseCategoryInput) => {
        const slug = await courseCategoriesService.generateUniqueSlug(input.title);
        const { data, error } = await (supabase
            .from('course_categories' as any) as any)
            .insert({ ...input, slug })
            .select()
            .single();
        if (error) throw error;
        return data as CourseCategoryDTO;
    },

    update: async ({ id, ...updates }: UpdateCourseCategoryInput) => {
        if (updates.title) {
            updates.slug = await courseCategoriesService.generateUniqueSlug(updates.title, id);
        }
        const { data, error } = await (supabase
            .from('course_categories' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseCategoryDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('course_categories' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
