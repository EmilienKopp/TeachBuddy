import { Model, type Relationship, type CastEntry } from './Model';
import { splitWords } from '$lib/helpers/Text';


export class Passage extends Model {
    
    protected static _table = 'passages';
    protected static _relations: Relationship[] = [
        { relation: 'tags', type: 'many-to-many', foreign_column: 'lang_code' }
    ]
    protected static _casts: CastEntry<any>[] = [
        ['created_at', Date, (date: Date) => date.toLocaleDateString('en-US',{ year: 'numeric', month: 'numeric', day: 'numeric' }) ],
    ]

    public split (): string[] | RegExpMatchArray {
        return splitWords(this.content);
    }

    
    
}

