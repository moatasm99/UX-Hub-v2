import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { siteSettingsService, type UpdateSiteSettingsInput } from '@/services/site-settings.service';

const QUERY_KEY = ['site-settings'];

export function useSiteSettings() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: siteSettingsService.getSettings,
        staleTime: 1000 * 60, // 60 seconds
    });

    const invalidate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }, [queryClient]);

    // Realtime: only UPDATE (single-row table, no INSERT/DELETE)
    useEffect(() => {
        const channel = supabase
            .channel('site-settings-realtime')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'site_settings' },
                invalidate
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [invalidate]);

    return {
        settings: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}

export function useUpdateSiteSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: Partial<UpdateSiteSettingsInput>) =>
            siteSettingsService.updateSettings(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}
