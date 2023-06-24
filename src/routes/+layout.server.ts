import type { LayoutServerLoad } from './$types';
import { Model } from '$lib/models/Model';
import { Profile } from '$lib/models/Profile';
import type { RequestEvent } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }: RequestEvent) => {
  console.log('LOAD @ Top level +layout.server.ts');
  console.time('layout_A_load');
  
  const session = async () => await getSession();
  
  console.timeEnd('layout_A_load');
  return {
    session: session(),
  };
};