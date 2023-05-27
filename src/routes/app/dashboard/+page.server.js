// @ts-nocheck

import { getLastGeneratedDate, isAllowedToGenerate } from '$lib/logic/passages';
import { message, superValidate } from 'sveltekit-superforms/server';

import { ENV } from '$env/static/private';
import { toSelectOptions } from '$lib/helpers/Arrays';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();

    const {count:passagesCount, error } = await supabase.from("passages").select("id", {count: 'exact', head: true}).eq("owner_id", user.id);
    const {count:wordsCount, error:wordsError } = await supabase.from("user_vocabulary").select("id", {count: 'exact', head: true}).eq("user_id", user.id);
    
    // Definitely a bug... The 'count' does not return AT ALL though there is one or more rows that DO get returned with the query
    let { data: friends, error: friendshipsError } = await supabase.from("friendships")
                                                                        .select("friend_id", {count: 'exact'})
                                                                        .eq("user_id", user.id)
                                                                        .eq("approved", true);
    if(error) {
        console.error(error);
    }

    const stats = {
        passagesCount,
        wordsCount,
        friendsCount: friends.length
    }

    return { stats };
}