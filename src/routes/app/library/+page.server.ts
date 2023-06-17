import { Passage } from "$lib/models/Passage";
import { Profile } from "$lib/models/Profile";
import type { RequestEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}: RequestEvent) {
    
    const { user } = await getSession();
        
    const passages = async () => await Passage.where('owner_id', 'eq', user.id);

    return { 
        user,
        passages: passages(),
     };
}



