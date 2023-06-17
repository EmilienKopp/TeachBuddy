import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { Collection } from './Collection';
import type { ZodAny } from 'zod';
import { vertical } from '$lib/helpers/Arrays';

enum SerializationType {
    JOIN = 'JOIN',
    RAW = 'RAW',
    SPLIT = 'SPLIT',
}

export type PostgresSerializable = {
    column: string,
    data: string | string [],
    separator: string,
    type: SerializationType,
    final: string,
    serialized: () => string,
};

export type ModelOptions = {
    rpc?: string,
}

export type Relationship = {
    relation: string,
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many',
    foreign_column?: string,
    distant_column?: string,
    local_column?: string,
}

type Caster<T> = (value: any) => T;
export type CastEntry<T> = [string, Caster<T>, ((value: T) => any) | Intl.DateTimeFormat | null];

export class Model {
    
    [key: string]: any;

    private readonly _metadata: any;
    private static _instance: Model;

    protected static _relations: Relationship[] = [];

    protected static _connector: any;
    protected static _table: string;
    protected static _idColumn: string = 'id';
    protected static _casts: CastEntry<any>[];

    // protected _serializable: PostgresSerializable = {
    //     column: '',
    //     data: '',
    //     separator: ',',
    //     final: '',
    //     type: SerializationType.RAW,
    //     serialized: () => {
    //         switch(this._serializable.type) {
    //             case SerializationType.JOIN:
    //                 return '(' + this.data.join(this._serializable.separator) + ')';
    //             case SerializationType.SPLIT:
    //             case SerializationType.RAW:
    //             default:
    //                 return '(' + this.data + ')'
    //         }
    //     },
    // };


    constructor(rowData: any, metadata?: any, client?: SupabaseClient) {
        this._table = (this.constructor as typeof Model)._table ?? '';
        this._idColumn = (this.constructor as typeof Model)._idColumn ?? 'id';
        const _casts = Object.getPrototypeOf(this).constructor._casts;
        // Build from rowData 
        if(rowData.data) {
            for(const [key, value] of Object.entries(rowData.data)) {
                const castEntry = _casts?.find( ([propName]: any) => propName === key);
                if(castEntry) {
                    console.log('castEntry', castEntry);
                    const [, cast, format]: any = castEntry;
                    this[key] = format ? format( new cast(value)) : new cast(value);
                } else {
                    this[key] = value;
                }
            }
            const {count,error,status} = rowData;
            this._metadata = {count,error,status};
        }
        // Build from object
        else {
            for(const [key, value] of Object.entries(rowData)) {
                const castEntry = _casts?.find( ([propName]: any) => propName === key);
                if(castEntry) {
                    const [, cast, format]: any = castEntry;
                    this[key] = format ? format( new cast(value)) : new cast(value);
                } else {
                    this[key] = value;
                }
                this._metadata = metadata;
            }
        }

    }

    public attributes () {
        const _relations = Object.getPrototypeOf(this).constructor._relations;
        
        const entries = Object.entries(this).filter( ([key, value]) => 
                                                            !key.startsWith('_') 
                                                            && !key.startsWith('$')
                                                            && !key.startsWith('fetch')
                                                            && !key.startsWith('connector')
                                                            && !['id','created_at','updated_at'].includes(key)
                                                            && !_relations?.some( (el: any) => el.relation == key) );
        const object = Object.fromEntries(entries);
        return object;
    }



    public define() {
        const _relations = Object.getPrototypeOf(this).constructor._relations;
        const _table = Object.getPrototypeOf(this).constructor._table;
        const _idColumn = Object.getPrototypeOf(this).constructor._idColumn;
        const _casts = Object.getPrototypeOf(this).constructor._casts;
        const _connector = (this.constructor as typeof Model)._connector;
        console.log('relations', _relations);
        console.log('table', _table);
        console.log('idColumn', this._idColumn);
        console.log('casts', _casts);
        console.log('connector', this.getConnection());
    }

    public static getInstance(): Model {
        if(!this._instance) {
            this._instance = new Model({});
        }
        return this._instance;
    }

    public connect (client?: any) {
        if(!this._connector) this._connector = client ?? createClient(PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_ANON_KEY);
        return this;
    }

    public getConnection () {
        return (this.constructor as typeof Model)._connector;
    }
    public static getConnection () {
        return Model._connector;
    }

    public static setConnection (client: any): void {
        this._connector = client;
    }

    public static setTableName (name: string): void {
        this._table = name;
    }

    public static getTableName (): string {
        return this._table;
    }

    // public exploded (column: string): PostgresSerializable {
    //     this._serializable.column = column;
    //     this._serializable.data = this[column];
    //     this._serializable.type = SerializationType.SPLIT;
    //     this._serializable.final = this._serializable.serialized();
    //     return this._serializable;
    // }

    public set (key: string, value: any): void {
        this[key] = value;
    }

    public async overwrite (key: string, value: any): Promise<any> {
        const current = this.constructor as typeof Model;
        this[key] = value;
        return await this._connector.from(current._table).update({ [key]: value }).eq(current._idColumn, this.id);
    }

    public async update( data: any ): Promise<any> {
        console.log('BEFORE:', this.attributes());
        for(const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        console.log('AFTER:', this.attributes());
        this.persist();
    }

    public async persist(options?: {withRelations?: boolean}): Promise<any> {
        const current = this.constructor as typeof Model;
        const attributes = this.attributes();
        if(options?.withRelations) {
            throw new Error('Not implemented yet');
        } else {
            // Remove from the attributes object the relations
            Object.keys(attributes).forEach( (key: string) => {
                if(this._relations?.some( (el: any) => el.relation == key)) {
                    delete attributes[key];
                }
            });
        }
        console.log('ATTRIBUTES', attributes);
        // const {data,error,status} = await this._connector.from(this._table).update(attributes)
        //                                          .eq(this._idColumn, this.id).select();
        const {data,error,status} = await this._connector.from(this._table).update({point_balance: 12345}).eq(this._idColumn, this.id);
        console.log(this._idColumn, this.id, data, error,status);

        return this;
    }

    public async resetHasMany(relation: string, foreignIdColumn: string, distantId: string, data: any, 
        options?: ModelOptions): Promise<any> {
        const current = this.constructor as typeof Model;
        
        data = data?.map( (item: any) => ({
            [distantId]: item, 
            [foreignIdColumn]: this[this._idColumn]}) 
        );

        let response;
        if(options?.rpc) {
            response = await this._connector.rpc(options.rpc, {data});
            console.log('RESPONSE using RPC', response);
        } else {
            // Upsert the data
            response = await this.getConnection().from('profiles').select('*');
            console.log('RESPONSE',response);
        }
        console.log('RESPONSE on standard upsert', response.data);
        
        // Delete the data that is not in the new data
        if(response?.data?.length) {
            console.log('deleting non updated ids');
            const insertedDistantIds = vertical(response.data, distantId, {serialize_postgres: true});

            const existing = await this._connector.from(relation).select(distantId).eq(foreignIdColumn, this[this._idColumn]);

            // Traverse existing data and delete if not in insertedDistantIds
            const toDelete = existing?.data?.filter( (item: any) => !insertedDistantIds.includes(item[distantId]) );
            if(toDelete && (toDelete.length ?? 0 > 0)) {
                const deleted = await this._connector.from(relation).delete().in(distantId, toDelete.map( (item: any) => item[distantId] ));
                console.log('deleted', deleted);
            }
        }

        return this;
    }

    public async delete(): Promise<any> {
        const current = this.constructor as typeof Model;
        return await current._connector.from(current._table).delete().eq(current._idColumn, this.id);
    }

    public static async create (data: any): Promise<any> {
        const response = await (this.getConnection()).from(this._table).insert(data).select().single();
        return new this(response);
    }

    public static async find (idOrColumn: string | number, value: any = null): Promise<any> {
        if(value)   
            return new this(await (this.getConnection()).from(this._table).select().eq(idOrColumn, value).single());
        else
            return new this(await (this.getConnection()).from(this._table).select().eq(this._idColumn, idOrColumn).single());
    }

    public static async all (raw: boolean = false): Promise<any> {
        const data = (await this._connector.from(this._table).select('*')).data;
        return new Collection(data);
    }

    
    public static async but(column: string, value: any) {
        const {count,error,status,data} = await this._connector.from(this._table).select().neq(column, value);
        return new Collection(data);
    }

    public static async where (column: string, postgresOperator: string, value: any): Promise<Collection<any>> {
        const {count,error,status,data} = await this._connector.from(this._table).select('*').filter(column, postgresOperator, value);
        return new Collection(data);
    }

    public static async only (column: string, value: any): Promise<Collection<any>> {
        const {count,error,status,data} = await this.getConnection().from(this._table).select('*').eq(column, value);
        return new Collection(data);
    }

    public static async edit (id: string | number, data: ZodAny): Promise<any> {
        const response = await this._connector.from(this._table).update(data).eq(this._idColumn, id);       
        return new this(response);
    }

    
    /**
     * Relationships
     */
    public async whereHas(relation: string, column:string, operator: string, value: any): Promise<any> {
        const current = this.constructor as typeof Model;
        const relationship = this._relations.find( (item: any) => item.relation === relation);
        const { data, count, error, status } = await this._connector.from(relationship?.relation)
                                                         .select().eq(relationship?.foreign_column, this[this._idColumn])
                                                         .filter(column, operator, value);
        const modeledData = data ? data?.map( (item: any) => new current(item, {count,error,status})) : [] ;
        return new Collection(modeledData);
    }

    public async getRelated(intermediate: typeof Model, column:string, operator: string, value: any): Promise<any> {
        const current = this.constructor as typeof Model;
        const relationship = current._relations.find( (item: any) => item.relation === intermediate._table);
        const currentModelName = current.name.toLowerCase();
        const { data, count, error, status } = await this.getConnection().from(intermediate._table)
                                     .select(`*, ${currentModelName}: ${current._table} ( * )`)
                                     .eq([currentModelName + '_id'], this.id)
                                     .filter(column, operator, value);
        const modeledData = data ? data?.map( (item: any) => new current(item, {count,error,status})) : [] ;
        return new Collection(modeledData);
    }

    public async getManyToMany(relationshipName: string): Promise<any> {
        const current = this.constructor as typeof Model;
        const relationship = current._relations.find( (item: any) => item.relation === relationshipName);
        const { data, count, error, status } = await this.getConnection().from(relationship.name).select(relationship.distant_column).eq(relationship.foreign_column, this[this._idColumn]);
        const modeledData = data ? data?.map( (item: any) => new current(item, {count,error,status})) : [] ;
        return new Collection(modeledData);
    }

    // const friendships =  async() => (await supabase.from('friendships')
    //                                                     .select('*, profile:profiles(*)')
    //                                                     .eq('profile_id', user.id)).data;

    public async with (relation: string) {
        const current = this.constructor as typeof Model;

        const _relations = Object.getPrototypeOf(this).constructor._relations;
        const relationship = _relations.find( (item: any) => item.relation === relation);

        const { data, count, error, status } = await (this.constructor as typeof Model)._connector.from(relationship?.relation)
                                                         .select().eq(relationship?.foreign_column, this[current._idColumn]);

        const modeledData = data ? data?.map( (item: any) => new current(item, {count,error,status})) : [] ;

        return new Collection(modeledData);
    }

    public static collect(arr: any[] ): Collection<any> {
        return new Collection(arr.map( (item: any) => new this(item) ));
    }

    public plain() {
        return structuredClone(this.attributes());
    }
    
}

