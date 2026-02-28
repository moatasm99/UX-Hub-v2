import { supabase } from '@/lib/supabase';

export type SubmissionType = 'feedback' | 'suggestion' | 'resource';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'added' | 'spam';

export interface CommunitySubmissionDTO {
    id: string;
    type: SubmissionType;
    title: string;
    message: string | null;
    url: string | null;
    resource_url_hash: string | null;
    status: SubmissionStatus;
    admin_notes: string | null;
    context_url: string | null;
    context_title: string | null;
    name: string | null;
    email: string | null;
    created_at: string;
    deleted_at: string | null;
    // Computed locally or via joins
    contributor_count?: number;
}

export interface CreateSubmissionInput {
    type: SubmissionType;
    title: string;
    message?: string;
    url?: string;
    context_url?: string;
    context_title?: string;
    name?: string;
    email?: string;
}

export interface SubmissionFilter {
    status?: SubmissionStatus;
    type?: SubmissionType;
    isDeleted?: boolean;
    lastCreatedAt?: string; // For cursor-based pagination
    limit?: number;
}

export interface ModerationStats {
    pending: number;
    approved: number;
    rejected: number;
    added: number;
    spam: number;
    trash: number;
}

// Helper: Generate SHA-256 hash for URL
async function generateUrlHash(url: string | undefined): Promise<string | null> {
    if (!url) return null;
    const msgUint8 = new TextEncoder().encode(url.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const communitySubmissionsService = {
    // Public: submit a new entry
    submit: async (input: CreateSubmissionInput) => {
        const resource_url_hash = await generateUrlHash(input.url);

        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .insert({
                ...input,
                resource_url_hash
            } as any)
            .select()
            .single();

        if (error) throw error;
        return data as CommunitySubmissionDTO;
    },

    // Admin: Optimized List with Cursor-Based Pagination
    list: async (filter: SubmissionFilter) => {
        let query = supabase
            .from('community_submissions')
            .select('*');

        // 1. Status/Deleted Filtering
        if (filter.isDeleted) {
            query = query.not('deleted_at', 'is', null);
        } else {
            query = query.is('deleted_at', null);
            if (filter.status) {
                query = query.eq('status', filter.status);
            }
        }

        // 2. Type Filtering
        if (filter.type) {
            query = query.eq('type', filter.type);
        }

        // 3. Cursor-Based Pagination
        if (filter.lastCreatedAt) {
            query = query.lt('created_at', filter.lastCreatedAt);
        }

        // 4. Ordering & Limit
        const { data: submissions, error } = await query
            .order('created_at', { ascending: false })
            .limit(filter.limit || 20);

        if (error) throw error;

        // 5. Calculate Contributor Stats for the page (Batch fetch counts)
        const emails = submissions
            ?.map(s => (s as any).email)
            .filter((email): email is string => !!email) || [];

        if (emails.length > 0) {
            const { data: counts } = await supabase
                .from('community_submissions' as any)
                .select('email, id.count()' as any)
                .in('email' as any, Array.from(new Set(emails)) as any)
                .filter('deleted_at' as any, 'is' as any, null);

            const countMap = (counts || []).reduce((acc: any, curr: any) => {
                acc[curr.email] = curr.count;
                return acc;
            }, {});

            submissions?.forEach((s: any) => {
                if (s.email) s.contributor_count = countMap[s.email] || 1;
            });
        }

        return submissions as CommunitySubmissionDTO[];
    },

    // Admin: Bulk Actions (Batch Updates)
    bulkUpdateStatus: async (ids: string[], status: SubmissionStatus) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .update({ status } as any)
            .in('id', ids)
            .select();

        if (error) throw error;

        // Log actions
        const user = (await supabase.auth.getUser()).data.user;
        const actions = ids.map(id => ({
            submission_id: id,
            action: status,
            admin_id: user?.id
        }));
        await (supabase.from('community_submission_actions' as any) as any).insert(actions);

        return data as CommunitySubmissionDTO[];
    },

    // Admin: Soft Delete / Restore
    setDeleted: async (ids: string[], isDeleted: boolean) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .update({ deleted_at: isDeleted ? new Date().toISOString() : null })
            .in('id', ids)
            .select();

        if (error) throw error;
        return data as CommunitySubmissionDTO[];
    },

    // Admin: Permanent Delete (Only from Trash)
    permanentlyDelete: async (ids: string[]) => {
        const { error } = await supabase
            .from('community_submissions')
            .delete()
            .in('id', ids);
        if (error) throw error;
    },

    // Admin: Update Admin Notes
    updateNotes: async (id: string, admin_notes: string) => {
        const { data, error } = await (supabase
            .from('community_submissions' as any) as any)
            .update({ admin_notes } as any)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CommunitySubmissionDTO;
    },

    // Admin: Optimized Stats
    getStats: async (): Promise<ModerationStats> => {
        const { data: statusCounts, error } = await supabase
            .rpc('get_submission_stats'); // We'll create this RPC for maximum performance

        if (error) {
            // Fallback for counts if RPC fails or not yet deployed
            const results = await Promise.all([
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending').is('deleted_at', null),
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved').is('deleted_at', null),
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected').is('deleted_at', null),
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).eq('status', 'added').is('deleted_at', null),
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).eq('status', 'spam').is('deleted_at', null),
                supabase.from('community_submissions').select('*', { count: 'exact', head: true }).not('deleted_at', 'is', null)
            ]);

            return {
                pending: results[0].count || 0,
                approved: results[1].count || 0,
                rejected: results[2].count || 0,
                added: results[3].count || 0,
                spam: results[4].count || 0,
                trash: results[5].count || 0
            };
        }

        return statusCounts;
    },

    // Admin: RPC Call to add submission to intensive courses or roadmap
    addToTarget: async (id: string) => {
        const { error } = await (supabase.rpc as any)('add_submission_to_target', {
            p_submission_id: id
        });
        if (error) throw error;
    }
};
