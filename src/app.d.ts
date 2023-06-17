import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';
import type { Translate } from '@google-cloud/translate/build/src/v2';
import type { Database } from "$lib/supabase";


declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      getSession(): Promise<Session | AppSession | null>;
      refreshSession(): Promise<Session | AppSession | null>;
      GT: Translate;
      user: User | CustomUser;
      session: any;
    }
    interface PageData {
      session: Session | null;
    }

    interface Session extends Session {
      user: User | CustomUser | null;
    }

    interface Profile {
      id: string | undefined | null;
      username?: string | undefined | null;
      native_language?: string | undefined | null;
      avatar_url?: string | undefined | null;
      user_number?: string | undefined | null;
      studying_languages?: string[] | undefined | null;
      point_balance?: number | undefined | null;
    }

    interface CustomUser extends User {
      profile?: Profile;
    }

    type GenerationPermission = {
      ok: boolean;
      error?: GenerationPermissionError;
      messages?: string[];
    }

    

    enum GenerationPermissionError {
      NotEnoughPoints,
      TooSoon,
      TrialExpired,
      Unknown
    }
    // interface Error {}
    // interface Platform {}
  }
}