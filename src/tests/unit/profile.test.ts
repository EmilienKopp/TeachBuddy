import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { beforeEach, describe, expect, it, test } from 'vitest';

import { Collection } from "$lib/models/Collection";
import { Model } from "$lib/models/Model";
import { Profile } from "$lib/models/Profile";
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


    it('Can use the parent class connection', async () => {
        Model.setConnection(supabase);
        const profile = new Profile({username: 'emiliberte'});
        expect(profile.getConnection()).toBeTruthy();
    });

    it('can use Profile.where to find one user', async () => {
        const userData = await Profile.where('username', 'eq','emiliberte');
        expect(userData).toBeTruthy();
        expect(userData).toBeInstanceOf(Collection);
        expect(userData.count()).toBe(1);
        expect(userData[0].username).toBe('emiliberte');
    });

    it('can use Profile.all() to find all users', async () => {
        const users = await Profile.all();
        const {data:rawSupabaseData, error} = await supabase.from('profiles').select('*');
        expect(users).toBeTruthy();
        expect(users).toBeInstanceOf(Collection);
        expect(users.count()).toBe(rawSupabaseData?.length);
    });

    it('can use Profile.but() to find all users exect certain ones', async () => {
        const users = await Profile.but('username', 'emiliberte');
        const {data: rawSupabaseData, error} = await supabase.from('profiles').select('*').neq('username', 'emiliberte');
        expect(users).toBeTruthy();
        expect(users).toBeInstanceOf(Collection);
        expect(users.count()).toBe(rawSupabaseData?.length);
    });

    it('can use Profile.only() to find data that has a where Equal condition satisfied', async () => {
        const users = await Profile.only('native_language', 'ja');
        const {data: rawSupabaseData, error} = await supabase.from('profiles').select('*').eq('native_language', 'ja');
        expect(users).toBeTruthy();
        expect(users).toBeInstanceOf(Collection);
        expect(users.count()).toBe(rawSupabaseData?.length);
    });

    it('can update itself', async () => {
        const user = await Profile.find('username','emiliberte');
        // user.update({user_number: '123456'});
        const response = await supabase.from('profiles').update({native_language: 'ja'}).eq('id', 'f448e7c5-e9d0-427a-81d0-3080a633ed09');
        const {data: rawSupabaseData, error} = await supabase.from('profiles').select('*').eq('username', 'emiliberte').single();
        console.log(response, rawSupabaseData);
        expect(user.user_number).toBe('123456');
        expect(rawSupabaseData?.user_number).toBe('123456');
    });
});
