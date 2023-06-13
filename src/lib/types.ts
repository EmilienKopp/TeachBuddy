import type { Database } from "$lib/supabase";
import type { User } from '@supabase/supabase-js';

export type PassageData = Database['public']['Tables']['passages']['Row'];

export type Tag = Database['public']['Tables']['tags']['Row'];
export type Word = Database['public']['Tables']['vocabulary']['Row'];
export type UserVocabulary = Database['public']['Tables']['user_vocabulary']['Row'];
export type POS = Database['public']['Tables']['parts_of_speech']['Row'];
export type Grade = Database['public']['Tables']['grades']['Row'];
export type Language = Database['public']['Tables']['languages']['Row'];
export type PointsMaster = Database['public']['Tables']['points_master']['Row'];
export type Friendship = Database['public']['Tables']['friendships']['Row'];
export type PassageLength = Database['public']['Tables']['passage_lengths']['Row'];
export type QualityLevel = Database['public']['Tables']['quality_levels']['Row'];



enum GenerationPermissionError {
    NotEnoughPoints,
    TooSoon,
    TrialExpired,
    Unknown
}

export interface Profile {
    id: string | undefined | null;
    username?: string | undefined | null;
    native_language?: string | undefined | null;
    avatar_url?: string | undefined | null;
    user_number?: string | undefined | null;
    studying_languages?: string[] | undefined | null;
    point_balance?: number | undefined | null;
}

export interface CustomUser extends User {
    profile?: Profile;
}

export type GenerationPermission = {
    ok: boolean;
    error?: GenerationPermissionError;
    messages?: string[];
}