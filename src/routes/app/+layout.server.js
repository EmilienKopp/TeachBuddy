// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    const {data: friendsRequests, error} = await supabase.from('friendships')
                                        .select('friend_id')
                                        .eq('friend_id', user.id)
                                        .eq('approved', false);
                                        
    const { data: grades, error: gradesError } = await supabase.from('grades').select('*');

    const { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);


    const {data: pointsMaster, error: pointsMasterError} = await supabase.from('points_master').select('*');

    const { data: tags, error: tagsError } = await supabase.from('tags').select('*');

    const { data: passages, error: passagesError } = await supabase.from('passages')
                                                      .select('*, passage_ratings(rating)')
                                                      .eq('owner_id', user.id);
    passages.map((passage) => { 
        const date = new Date(passage.created_at);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        passage.date = formattedDate;
        passage.tags = tags?.filter(tag => tag.taggable_id == passage.id);
        return passage;
    });

    const {data: words, error: wordsError } = await supabase.from("user_vocabulary").select('*').eq("user_id", user.id);
    
    // Definitely a bug... The 'count' does not return AT ALL though there is one or more rows that DO get returned with the query
    const { data: friends, error: friendshipsError } = await supabase.from("friendships")
                                                                        .select("*")
                                                                        .eq("user_id", user.id)
                                                                        .eq("approved", true);
    
    const { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');

    return { friendsRequests, grades, languages, pointsMaster, friends, passages, words, POS, tags };
}
