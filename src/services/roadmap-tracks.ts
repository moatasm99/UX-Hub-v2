import { supabase } from '@/lib/supabase';

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export interface RoadmapTrackDTO {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    icon: string | null;
    color: string | null;
    position: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateRoadmapTrackInput = Omit<RoadmapTrackDTO, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRoadmapTrackInput = Partial<CreateRoadmapTrackInput> & { id: string };

export const roadmapTracksService = {
    getPublished: async () => {
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .select('*')
            .eq('is_published', true)
            .order('position', { ascending: true });
        if (error) throw error;
        return data as RoadmapTrackDTO[];
    },

    getAll: async () => {
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .select('*')
            .order('position', { ascending: true });
        if (error) {
            console.error('[roadmap-tracks] getAll error:', error);
            throw error;
        }
        return data as RoadmapTrackDTO[];
    },

    generateUniqueSlug: async (title: string, excludeId?: string): Promise<string> => {
        const base = slugify(title);
        let candidate = base;
        let suffix = 1;
        while (true) {
            const query = (supabase.from('roadmap_tracks' as any) as any)
                .select('id').eq('slug', candidate).limit(1);
            const { data } = excludeId ? await query.neq('id', excludeId) : await query;
            if (!data || data.length === 0) return candidate;
            candidate = `${base}-${suffix}`;
            suffix++;
        }
    },

    create: async (input: CreateRoadmapTrackInput) => {
        const slug = await roadmapTracksService.generateUniqueSlug(input.title);

        // Get max position to append at the end
        const { data: maxPosData } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .select('position')
            .order('position', { ascending: false })
            .limit(1);

        const nextPosition = maxPosData && maxPosData.length > 0
            ? (maxPosData[0].position + 1)
            : 0;

        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .insert({
                ...input,
                slug,
                position: nextPosition
            })
            .select()
            .single();
        if (error) throw error;
        return data as RoadmapTrackDTO;
    },

    update: async ({ id, ...updates }: UpdateRoadmapTrackInput) => {
        if (updates.title) {
            updates.slug = await roadmapTracksService.generateUniqueSlug(updates.title, id);
        }
        const { data, error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as RoadmapTrackDTO;
    },

    delete: async (id: string) => {
        const { error } = await (supabase
            .from('roadmap_tracks' as any) as any)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};
