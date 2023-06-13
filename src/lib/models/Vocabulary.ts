import { Language } from "$lib/models/Language";
import { Model } from "$lib/models/Model";
import type { PostgresSerializable } from "$lib/models/Model";

export class Vocabulary extends Model {
    protected _table = 'vocabulary';
    protected _idColumn = 'id';
    protected _relations = ['language'];

    public async fetchLanguage(): Promise<Language> {
        const row = await this._connector.from('languages').select('*').eq('lang_code', this.lang_code).single();
        return row ? new Language(row) : {} as Language;
    }

    public inflectionsAsArray(): PostgresSerializable | string | string[] {
        return this.inflections.split(',');
    }
}