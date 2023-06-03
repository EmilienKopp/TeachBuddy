import type { User } from '@supabase/supabase-js';

export interface CustomUser extends User {
    profile?: {
        id: string | undefined | null;
        username?: string | undefined | null;
        native_language?: string | undefined | null;
        avatar_url?: string | undefined | null;
        user_number?: string | undefined | null;
        studying_languages?: string[] | undefined | null;
        point_balance?: number | undefined | null;
    } | undefined | null;
}

export type GenerationPermission = {
    ok: boolean;
    error?: "not_enough_points" | "too_soon" | "trial_expired" | "unknown" ;
    messages?: string[];
}