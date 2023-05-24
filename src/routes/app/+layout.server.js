// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();

    const {data: friendsRequests, error} = await supabase.from('friendships')
                                        .select('friend_id')
                                        .eq('friend_id', user.id)
                                        .eq('approved', false);
    let { data: profile, error: profilesError } = await supabase.from('profiles')
                                                                .select('*')
                                                                .eq('id', user.id).single();

    const {data: pointsMaster, error: pointsMasterError} = await supabase.from('points_master').select('*');

    user.profile = profile;
    
    console.log(friendsRequests, pointsMaster)

    return { friendsRequests, user };
}
