import { Friendship } from "$lib/models/Friendship";
import { Language } from "$lib/models/Language";
import { Model, type Relationship } from "./Model";
import { vertical } from "$lib/helpers/Arrays";
import { Collection } from "./Collection";

export class Profile extends Model {
    
    protected static _table = 'profiles';

    protected _relations = [
        {
            relation: 'studying_languages',
            type: 'many-to-many',
            foreign_column: 'user_id',
            select_columns: ['lang_code'],
            returnVerticalArray: true,
        } as Relationship,
        {
            relation: 'friendships',
            type: 'many-to-many',
            foreign_column: 'profile_id',
            where: [
                {column: 'approved', operator: '=', value: true},
            ]
        } as Relationship,
    ];

    constructor (rowData: any, metadata?: any) {
        super(rowData, metadata);
    }

    

    /**
     * Relationships with Friends / Friendships
     */
    public async getFriendsRequests (): Promise<Collection<Friendship>> {
        const {data} = await this.getConnection().from('friendships')
                                          .select('*')
                                          .eq('friend_id', this.id)
                                          .eq('accepted', false);
        
        return new Collection(data);
    }

    public async getFriends (): Promise<Collection<Friendship>> {
        const data = await this.getRelated(Friendship, 'approved','is', true)
        return data;
    }

    /**
     * Relationships with Languages
     */
    public async nativeLanguage (): Promise<Language> {
        const row = await this.getConnection().from('languages').select('*').eq('lang_code', this.native_language).single();
        return row ? new Language(row) : {} as Language;
    }

    public async studyingLanguages (): Promise<Language[]> {
        const rows = await this.getConnection().from('languages').select('*').in('lang_code', this.studying_languages);
        const modeledData = rows?.data?.map((row: any) => new Language(row));
        return new Collection(modeledData ?? []);
    }

    public async setNativeLanguage(language: string | Language): Promise<Profile> {
        if(language instanceof Language) {
            this.native_language = language.lang_code;
        } else {
            this.native_language = language;
        }
        this.persist();

        return this;
    }

    public async setStudyingLanguages(languages: string[], firstInsert: boolean = false): Promise<Profile> {

        this.studying_languages = languages;
        let options = {};
        if(firstInsert === true) options = { rpc: 'insert_user_studying_languages'};
        this.resetHasMany('studying_languages', 'user_id', 'lang_code', languages, options);
        return this;
    }

    public updateTargetLanguages (languages: string[] | Language[]): Profile {
        if(typeof languages[0] != 'string') {
            languages = vertical(languages,'lang_code') as string[];
        }
        this.resetHasMany('studying_languages', 'user_id', 'lang_code', languages);
        
        return this;
    }   

    public sendFriendRequest (friendId: string): Profile {
        this._connector.from('friendships').insert([{ user_id: this.id, friend_id: friendId }]);
        return this;
    }

    public acceptFriendRequest (friendId: string): Profile {
        this._connector.from('friendships').update({ accepted: true }).eq('user_id', friendId).eq('friend_id', this.id);
        return this;
    }

}