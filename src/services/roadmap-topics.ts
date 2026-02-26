import { supabase } from '@/lib/supabase';

export interface RoadmapTopicDTO {
    id: string;
    track_id: string;
    title: string;
    description: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateRoadmapTopicInput = Omit<RoadmapTopicDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRoadmapTopicInput = Partial<CreateRoadmapTopicInput> & { id: string };

import { RoadmapResourceDTO } from './roadmap-resources';

export interface TopicWithResourcesDTO extends RoadmapTopicDTO {
    roadmap_resources: RoadmapResourceDTO[];
}

export const roadmapTopicsService = {
    getPublishedByTrack: async (trackId: string) => {
        const { data, error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .select('*')
            .eq('track_id', trackId)
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as RoadmapTopicDTO[];
    },

    getPublishedByTrackWithResources: async (trackId: string) => {
        const { data, error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .select(`
                id, track_id, title, description, position, is_published, created_at, updated_at,
                roadmap_resources (id, topic_id, title, url, type, position, is_published, created_at, updated_at)
            `)
            .eq('track_id', trackId)
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        // Filter to only published resources and sort by position
        return (data as any[]).map(topic => ({
            ...topic,
            roadmap_resources: (topic.roadmap_resources || [])
                .filter((r: any) => r.is_published)
                .sort((a: any, b: any) => a.position - b.position),
        })) as TopicWithResourcesDTO[];
    },

    getByTrack: async (trackId: string) => {
        const { data, error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .select('*')
            .eq('track_id', trackId)
            .order('position', { ascending: true });

        if (error) throw error;
        return data as RoadmapTopicDTO[];
    },

    create: async (input: CreateRoadmapTopicInput) => {
        // Get max position to append at the end if position is not provided or is 0
        let position = input.position;
        if (!position) {
            const { data: maxPosData } = await (supabase
                .from('roadmap_topics' as any) as any)
                .select('position')
                .eq('track_id', input.track_id)
                .order('position', { ascending: false })
                .limit(1);

            position = maxPosData && maxPosData.length > 0
                ? (maxPosData[0].position + 1)
                : 0;
        }

        const { data, error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .insert({ ...input, position })
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapTopicDTO;
    },

    update: async ({ id, ...updates }: UpdateRoadmapTopicInput) => {
        const { data, error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as RoadmapTopicDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('roadmap_topics' as any) as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
