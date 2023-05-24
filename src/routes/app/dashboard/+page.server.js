// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession }}) {
    const { user } = await getSession();

    let { data: profile, error: profilesError } = await supabase.from('profiles')
                                                                .select('*')
                                                                .eq('id', user.id).single();
    user.profile = profile;

                                                            
    return { user };
}