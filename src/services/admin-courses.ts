import { supabase } from '@/lib/supabase';

// ─── Slug helper ──────────────────────────────────────
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Matches the database schema
export interface CourseDTO {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string | null;
    type: 'intensive' | 'roadmap';
    icon: string | null;
    order_index: number;
    is_published: boolean;
    created_at?: string;
}

export type CreateCourseInput = Omit<CourseDTO, 'id' | 'created_at'>;
export type UpdateCourseInput = Partial<CreateCourseInput> & { id: string };

export const adminCoursesService = {
    // 1. List all courses
    getAll: async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data as CourseDTO[];
    },

    // 2. Generate a unique slug
    generateUniqueSlug: async (title: string, excludeId?: string): Promise<string> => {
        const base = slugify(title);
        let candidate = base;
        let suffix = 1;

        while (true) {
            const query = supabase
                .from('courses')
                .select('id')
                .eq('slug', candidate)
                .limit(1);

            const { data } = excludeId
                ? await query.neq('id', excludeId)
                : await query;

            if (!data || data.length === 0) return candidate;
            candidate = `${base}-${suffix}`;
            suffix++;
        }
    },

    // 3. Create a course (auto-generates slug from title)
    create: async (input: CreateCourseInput) => {
        const slug = await adminCoursesService.generateUniqueSlug(input.title);
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .insert({ ...input, slug })
            .select()
            .single();

        if (error) throw error;
        return data as CourseDTO;
    },

    // 4. Update a course (regenerates slug if title changed)
    update: async ({ id, ...updates }: UpdateCourseInput) => {
        if (updates.title) {
            updates.slug = await adminCoursesService.generateUniqueSlug(updates.title, id);
        }
        const { data, error } = await (supabase
            .from('courses' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as CourseDTO;
    },

    // 5. Delete a course
    delete: async (id: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
