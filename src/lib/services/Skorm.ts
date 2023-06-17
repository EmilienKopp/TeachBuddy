import { Model } from '$lib/models/Model';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { models } from '$lib/models/exports';
import type { Profile } from '$lib/models/Profile';
import type { RequestEvent } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

class Skorm {

    protected static connection: SupabaseClient;
    protected static authProfile: Profile | object | undefined;

    static [key: string]: any;

    constructor(client: SupabaseClient) {
        console.log('DbService initialized');
        Object.entries(models).forEach(([key, value]) => {
            Skorm[key.toLowerCase()] = value;
        });
        Skorm.connection = client;
        Model.setConnection(client);
    }

    public static async getAuthProfile(profileTable: string = 'profiles'): Promise<any | undefined> {
        const { data: { session } } = await Skorm.connection.auth.getSession();
        if (session && session.user) {
            const {data: profileData, error} = await Skorm.connection.from(profileTable).select('*').eq('id', session.user.id).single();
            Skorm.authProfile = profileData;
            return profileData;
        }
        return undefined;
    }

    public static async getSession() {
        const { data: { session } } = await Skorm.connection.auth.getSession();
        return session;
    }

    public static async attachToProfile(data: any) {
        Skorm.authProfile = {...Skorm.authProfile, ...data};
        console.log('Attaching', data)
    }

    public static getConnection() {
        return Skorm.connection;
    }

}

export class SkormClient extends Skorm {

    static [key: string]: any;

    constructor () {
        console.log('SkormClient initialized');
        const client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
        super(client);
    }

}

export class SkormServer extends Skorm{
    
    static [key: string]: any;

    constructor (event: RequestEvent) {
        console.log('SkormServer initialized');
        const client = createSupabaseServerClient({supabaseKey: PUBLIC_SUPABASE_ANON_KEY, supabaseUrl: PUBLIC_SUPABASE_URL, event});
        super(client);
    }
    
    public static initialize (event: RequestEvent) {
        console.log('SkormServer initialize');
        const client = createSupabaseServerClient({supabaseKey: PUBLIC_SUPABASE_ANON_KEY, supabaseUrl: PUBLIC_SUPABASE_URL, event});
        Skorm.connection = client;
        Skorm.INSTANCE = new SkormServer(event);
    }

    public get session () {
        return Skorm.connection.auth.getSession();
    }
}