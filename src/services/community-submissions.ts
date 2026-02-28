import { supabase } from '@/lib/supabase';

export type SubmissionType = 'feedback' | 'suggestion' | 'resource';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface CommunitySubmissionDTO {
    id: string;
    type: SubmissionType;
    title: string;
    message: string | null;
    url: string | null;
    status: SubmissionStatus;
    context_url: string | null;
    context_title: string | null;
    created_at: string;
}

export interface CreateSubmissionInput {
    type: SubmissionType;
    title: string;
    message?: string;
    url?: string;
    context_url?: string;
    context_title?: string;
}

export const communitySubmissionsService = {
    // Public: submit a new entry
    submit: async (input: CreateSubmissionInput) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .insert(input)
            .select()
            .single();
        if (error) throw error;
        return data as CommunitySubmissionDTO;
    },

    // Admin: get all by status
    getByStatus: async (status: SubmissionStatus) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as CommunitySubmissionDTO[];
    },

    // Admin: get by type and status
    getByTypeAndStatus: async (type: SubmissionType, status: SubmissionStatus) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .select('*')
            .eq('type', type)
            .eq('status', status)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as CommunitySubmissionDTO[];
    },

    // Admin: update status
    updateStatus: async (id: string, status: SubmissionStatus) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CommunitySubmissionDTO;
    },
};
