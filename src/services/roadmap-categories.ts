import { supabase } from '@/lib/supabase';

export interface RoadmapCategoryDTO {
    id: string;
    title: string;
    slug: string;
    color: string | null;
    icon: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateRoadmapCategoryInput = Omit<RoadmapCategoryDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRoadmapCategoryInput = Partial<CreateRoadmapCategoryInput> & { id: string };

export const roadmapCategoriesService = {
    getAll: async () => {
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .select('*')
            .order('position', { ascending: true });

        if (error) throw error;
        return data as RoadmapCategoryDTO[];
    },

    create: async (input: CreateRoadmapCategoryInput) => {
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapCategoryDTO;
    },

    update: async ({ id, ...updates }: UpdateRoadmapCategoryInput) => {
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapCategoryDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
