import { supabase } from '@/lib/supabase';

export const RESOURCE_TYPES = ['Video', 'Article', 'Book', 'Podcast', 'Course', 'Tool'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface RoadmapResourceDTO {
    id: string;
    topic_id: string;
    title: string;
    url: string;
    type: ResourceType;
    label: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateRoadmapResourceInput = Omit<RoadmapResourceDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRoadmapResourceInput = Partial<CreateRoadmapResourceInput> & { id: string };

export const roadmapResourcesService = {
    getPublishedByTopic: async (topicId: string) => {
        const { data, error } = await (supabase
            .from('roadmap_resources' as any) as any)
            .select('*')
            .eq('topic_id', topicId)
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as RoadmapResourceDTO[];
    },

    getByTopic: async (topicId: string) => {
        const { data, error } = await (supabase
            .from('roadmap_resources' as any) as any)
            .select('*')
            .eq('topic_id', topicId)
            .order('position', { ascending: true });

        if (error) throw error;
        return data as RoadmapResourceDTO[];
    },

    create: async (input: CreateRoadmapResourceInput) => {
        const { data, error } = await (supabase
            .from('roadmap_resources' as any) as any)
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapResourceDTO;
    },

    update: async ({ id, ...updates }: UpdateRoadmapResourceInput) => {
        const { data, error } = await (supabase
            .from('roadmap_resources' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapResourceDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('roadmap_resources' as any) as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
