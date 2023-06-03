// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession }}) {
    const { user } = await getSession();

    let { data: profiles, error: profilesError } = await supabase.from('profiles')
                                               .select('id, username, first_name, last_name');
    let { data: friendships, error: friendshipsError } = await supabase.from('friendships')
                                                 .select('friend_id')
                                                 .eq('user_id', user.id)
                                                 .eq('approved', true);
    let { data: friends, error: friendsError } = await supabase.from('profiles')
                                                               .select('id, username, first_name, last_name')
                                                                .in('id', friendships.map(friendship => friendship.friend_id));
                                                                
    return { profiles, friends };
}