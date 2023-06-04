// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession }}) {
    console.time('friends+server_load');
    const { user } = await getSession();

    const profiles = async() => (await supabase.from('profiles')
                                               .select('id, username, first_name, last_name')).data;
                                                   
    const friendships =  async() => (await supabase.from('friendships')
                                                        .select('*, profile:profiles(*)')
                                                        .eq('profile_id', user.id)).data;
                                                        

    console.timeEnd('friends+server_load');
    return { 
        profiles: profiles(), 
        friendships: friendships()
    };
}