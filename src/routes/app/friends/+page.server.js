// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession }}) {
    const { user } = await getSession();

    let { data: profiles, error: profilesError } = await supabase.from('profiles')
                                               .select('id, username, first_name, last_name');
    let { data: friendships, error: friendshipsError } = await supabase.from('friendships')
                                                 .select('friend_id,approved')
                                                 .eq('user_id', user.id);
    let { data: friends, error: friendsError } = await supabase.from('profiles')
                                                               .select('id, username, first_name, last_name')
                                                                .in('id', friendships.filter( el => el.approved ).map(friendship => friendship.friend_id));
    console.log( friends, friendships);
    return { profiles, friends, friendships };
}