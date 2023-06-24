import { Collection } from './Collection';
import { Model, type Relationship } from './Model';
import { Profile } from '$lib/models/Profile';

export class Language extends Model {
    
    protected static _table = 'languages';
    protected static _idColumn = 'lang_code';
    

    public async nativeSpeakers (): Promise<Profile> {
        const row = await this._connector.from('profiles').select('*').eq('native_language', this.lang_code).single();
        return row ? new Profile(row) : {} as Profile;
    }

    public static async getSelectable(): Promise<Collection<Language>> {
        const rows = await super._connector.from('languages').select('*').eq('enabled', true);
        if(rows && rows.data)
            return new Collection(rows.data.map((row: any) => new Language(row)));
        else
            return new Collection([]);
    }
}