import { Passage } from "$lib/models/Passage";

export async function load({data}: any) {
    const passage = new Passage(data.passageData, data.supabase);

    return { passage };
}