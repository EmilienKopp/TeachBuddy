import { Language } from '$lib/models/Language';
import { Passage } from '$lib/models/Passage';
import { Profile } from '$lib/models/Profile';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
//@ts-nocheck
export async function load({locals: { supabase, getSession}}: RequestEvent) {

    const { user } = await getSession() as App.Session;
    const userProfile = new Profile(user);

    const dateFormatter = new Intl.DateTimeFormat('en-US',{ year: 'numeric', month: 'long', day: 'numeric' });

    const friendRequests = async () => (await userProfile.getFriendsRequests()).plain();

    const languages = async() => (await Language.but('name_native', null )).plain();

    const pointsMaster = async () => {
        const {data} = await supabase.from('points_master').select('*');
        return data ?? [];
    }

    const tags = async () => {
        const { data } = await supabase.from('tags').select('*');
        return data ?? [];
    }

    // const { data: passages, error: passagesError } = await supabase.from('passages')
    //                                                   .select('*, passage_ratings(rating)')
    //                                                   .eq('owner_id', user.id);
    
    // passages?.map((passage: any) => { 
    //     const date = new Date(passage.created_at ?? Date.now());
    //     const formattedDate = dateFormatter.format(date);
    //     passage.created_at = formattedDate;
    //     passage.tags = tags?.filter( (tag: any) => tag.taggable_id == passage.id.toString());
    //     return passage;
    // });

    // const {data: words, error: wordsError } = await supabase.from("user_vocabulary").select('*').eq("user_id", user.id);
    const words = async () => {
        const { data } = await supabase.from("user_vocabulary").select('*').eq("user_id", user.id);
        return data ?? [];
    }

    // Definitely a bug... The 'count' does not return AT ALL though there is one or more rows that DO get returned with the query
    // const { data: friends, error: friendshipsError } = await supabase.from("friendships")
    //                                                                     .select("*")
    //                                                                     .eq("user_id", user.id)
    //                                                                     .eq("approved", true);
    const friends = async () => (await userProfile.getFriends()).plain();
    
    // const { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');
    const POS = async () => {
        const { data } = await supabase.from('parts_of_speech').select('*');
        return data ?? [];
    }

    const passages = async () => {
        const data = (await Passage.only('owner_id',  user.id)).plain();
        return data ?? [];
    }

    return { 
        friendsRequests: friendRequests(),
        languages: languages(), 
        pointsMaster: pointsMaster(),
        friends: friends(),
        words: words(),
        POS: POS(), 
        tags: tags(),
        passages: passages(),
     };
}
