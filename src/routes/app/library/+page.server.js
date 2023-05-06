// @ts-nocheck

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();

    let { data: passagesData, error } = await supabase.from('passages').select('*').eq('owner_id', user.id);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    

    passagesData.map((passage) => { 
        const date = new Date(passage.created_at);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        console.log(formattedDate);
        passage.created_at = formattedDate;
        console.log(passage);
        return passage;
    });

    return { passagesData };
}
