import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseClient, createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import { expect, test } from 'vitest';
import crypto from 'crypto';

import { Model } from '$lib/models/Model';
import { Profile } from '$lib/models/Profile';
import { Language } from '$lib/models/Language';

// const mockStorageProvider = {
//     data: new Map<string, any>(),
//     getItem: async (key: string) => {
//         return mockStorageProvider.data.get(key);
//     },
//     setItem: async (key: string, value: any) => {
//         mockStorageProvider.data.set(key, value);
//     },
//     removeItem: async (key: string) => {
//         mockStorageProvider.data.delete(key);
//     }
// }

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);


Model.setConnection(supabase);

test('Connection is authenticated', () => {
    expect(Model.getConnection().auth).toBeTruthy();
})

test('Connection is initialized and unique', () => {
    const profileA = new Profile({id: 1});
    const profileB = new Profile({id: 2});
    const connA = profileA.getConnection().toString();
    const connB = profileB.getConnection().toString();
    expect(connA).toEqual(connB);
});

test('Connection is initialized and common to other models', () => {
    const profile = new Profile({id: 1});
    const language = new Language({id: 2});
    const connA = profile.getConnection().toString();
    const connB = language.getConnection().toString();
    expect(connA).toEqual(connB);
});

test('Profile model can update and persist itself', async () => {
    const profile = new Profile({id: 1, username: 'TEST', studying_languages: ['en', 'es']});

    profile.update({username: 'newNAME'});

    expect(profile.username).toEqual('newNAME');
    const {data,error} = supabase.from('profiles').select('*').eq('id', 1);
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data[0].username).toEqual('newNAME');
});


function init() {
    
}