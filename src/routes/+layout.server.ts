import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }) => {
  console.log('LOAD @ Top level +layout.server.ts');
  console.time('layout_A_load');
  
  const session = async () => await getSession();

  console.timeEnd('layout_A_load');
  return {
    session: session(),
  };
};