import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { beforeEach, describe, expect, it, test } from 'vitest';

import { Collection } from "$lib/models/Collection";
import { Model } from "$lib/models/Model";
import { Profile } from "$lib/models/Profile";
import { Topic } from "$lib/models/Topic";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

describe('anonymous user', () => {
    it('can read all user profiles', async () => {
        const { data, error } = await supabase.from('profiles').select('username').order('username');
        const usernames = data?.map((entry: any) => entry.username);
        expect(error).toBeFalsy();
        expect(usernames).toBeTruthy();
    });
});

describe('authenticated user', () => {
    beforeEach(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: 'liberte.emilien@gmail.com',
            password: 'spitfire',
        });
        console.error(error);
        Model.setConnection(supabase);
        expect(error).toBeFalsy();
    });

    it('can update data', async () => {
        const topic = await Topic.find(1);
        
        console.log(topic);

        const {data,error,status} = await supabase.from('topics').update({prompt: 'new title'}).eq('id', 1);

        console.log(data,error,status, await Topic.find(1));
        expect(error).toBeFalsy();
    });
});
