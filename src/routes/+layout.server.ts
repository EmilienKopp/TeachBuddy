import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }) => {

  const session = await getSession();
  console.log('calling getSession from +layout.server.ts');

  const { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single();
  const { data: studyingLanguages, error: studyingLangError} = await supabase.from('studying_languages').select('lang_code').eq('user_id', session?.user.id);
  

  if(studyingLanguages && profileData) {
      profileData.studying_languages = studyingLanguages.map(el => el.lang_code);
      (session?.user as any).profile = profileData;
  }
  
  return {
    session,
  };
};