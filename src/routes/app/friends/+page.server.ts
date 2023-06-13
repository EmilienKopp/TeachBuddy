import { Passage } from "$lib/models/Passage";
import { Profile } from "$lib/models/Profile";
import type { RequestEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession }}: RequestEvent) {
    console.time('friends+server_load');
    const { user } = await getSession();

    const profiles = async() => (await Profile.all()).plain();
                                                        

    console.timeEnd('friends+server_load');

    return { 
        profiles: profiles(), 
    };
}