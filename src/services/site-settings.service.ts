import { supabase } from '@/lib/supabase';

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

export interface SiteSettingsDTO {
    id: string;
    hero_badge_text: string;
    hero_title_line_1: string;
    hero_title_line_2: string;
    hero_role_label: string;
    hero_description: string | null;
    hero_button_text: string;
    hero_button_url: string;
    hero_image_url: string | null;
    hero_experience_label: string;
    hero_experience_value: string;
    updated_at: string;
}

export type UpdateSiteSettingsInput = Omit<SiteSettingsDTO, 'id' | 'updated_at'>;

export const siteSettingsService = {
    getSettings: async (): Promise<SiteSettingsDTO> => {
        const { data, error } = await (supabase
            .from('site_settings' as any) as any)
            .select('*')
            .eq('id', SINGLETON_ID)
            .single();

        if (error) {
            // If row doesn't exist, insert default and retry
            if (error.code === 'PGRST116') {
                const { data: inserted, error: insertError } = await (supabase
                    .from('site_settings' as any) as any)
                    .insert({ id: SINGLETON_ID })
                    .select()
                    .single();

                if (insertError) throw insertError;
                return inserted as SiteSettingsDTO;
            }
            throw error;
        }

        return data as SiteSettingsDTO;
    },

    updateSettings: async (input: Partial<UpdateSiteSettingsInput>): Promise<SiteSettingsDTO> => {
        const { data, error } = await (supabase
            .from('site_settings' as any) as any)
            .update(input)
            .eq('id', SINGLETON_ID)
            .select()
            .single();

        if (error) throw error;
        return data as SiteSettingsDTO;
    },
};
