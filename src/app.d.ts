import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';
import type { Translate } from '@google-cloud/translate/build/src/v2';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      getSession(): Promise<Session | null>;
      refreshSession(): Promise<Session | null>;
      GT: Translate;
      user: User | CustomUser;
      session: any;
    }
    interface PageData {
      session: Session | null;
    }
    
    // interface Error {}
    // interface Platform {}
  }
}