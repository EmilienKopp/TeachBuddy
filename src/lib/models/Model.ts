import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

import { Collection } from './Collection';
import type { ZodAny } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { resolveOperator } from './resolvers';
import { vertical } from '$lib/helpers/Arrays';

enum SerializationType {
    JOIN = 'JOIN',
    RAW = 'RAW',
    SPLIT = 'SPLIT',
}

export type PostgresSerializable = {
    column: string,
    data: string | string[],
    separator: string,
    type: SerializationType,
    final: string,
    serialized: () => string,
};

export type ModelOptions = {
    rpc?: string,
}

type DataFetchOptions = {
    asPlainObject?: boolean,
    orderBy?: string, 
    direction?: 'asc' | 'desc', 
    limit?: number
}

type WhereClause = {
    column: string,
    operator: string,
    value: any,
}

export type Relationship = {
    relation: string,
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many',
    foreign_column?: string,
    local_column?: string,
    select_columns?: string[],
    where?: WhereClause[],
    returnVerticalArray?: boolean,
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


    constructor(rowData: any, metadata?: any) {
        this._table = (this.constructor as typeof Model)._table ?? '';
        this._idColumn = (this.constructor as typeof Model)._idColumn ?? 'id';
        const _casts = Object.getPrototypeOf(this).constructor._casts;
        // Build from rowData 
        if (rowData.data) {
            console.log('Building from rowData', rowData)
            for (const [key, value] of Object.entries(rowData.data)) {
                const castEntry = _casts?.find(([propName]: any) => propName === key);
                if (castEntry) {
                    console.log('castEntry', castEntry);
                    const [, cast, format]: any = castEntry;
                    this[key] = format ? format(new cast(value)) : new cast(value);
                } else {
                    this[key] = value;
                }
            }
            const { count, error, status } = rowData;
            this._metadata = { count, error, status };
        }
        // Build from object
        else {
            for (const [key, value] of Object.entries(rowData)) {
                const castEntry = _casts?.find(([propName]: any) => propName === key);
                if (castEntry) {
                    const [, cast, format]: any = castEntry;
                    this[key] = format ? format(new cast(value)) : new cast(value);
                } else {
                    this[key] = value;
                }
                this._metadata = metadata;
            }
        }

        for(const [key,value] of Object.entries(this)) {
            if(typeof value != 'function' && !key.startsWith('_') && key != 'id') {
                this['$' + key] = async (arg: any): Promise<any | void> => { 
                    if(arg) {
                        this[key] = arg;
                        await this.update( { [key]: arg} );
                    } else {
                        await this.refresh();
                        return this[key];
                    }
                }
                this['$$' + key] = (arg: any): any | void => {
                    if(arg) {
                        this[key] = arg;
                        this.update( { [key] : arg });
                    } else {
                        this.refresh();
                        return this[key];
                    }
                }
            }
        }
    }

    public attributes() {
        const _relations = Object.getPrototypeOf(this).constructor._relations;

        const entries = Object.entries(this).filter(([key, value]) =>
            !key.startsWith('_')
            && !key.startsWith('$')
            && !key.startsWith('fetch')
            && !key.startsWith('connector')
            && !['created_at', 'updated_at'].includes(key)
            && !_relations?.some((el: any) => el.relation == key));
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

    public async refresh() {
        return await this.getConnection().from(this._table).select().eq(this._idColumn, this[this._idColumn]);
    }

    public async relate() {
        // Build relationships
        if(this._relations) {
            for (const relation of this._relations) {
                if (relation.type === 'many-to-many') {
                    let relationData = (await this.getManyToMany(relation.relation)).plain();
                    if (relation.returnVerticalArray) {
                        const key = relation?.select_columns?.at(0) ?? 'id';
                        relationData = vertical(relationData, key);
                    }
                    this[relation.relation] = relationData;
                }
            }
    }
        return this;
    }

    public static getInstance(): Model {
        if (!this._instance) {
            this._instance = new this({});
        }
        return this._instance;
    }

    public connect() {
        this._connector = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
        return this;
    }

    public getConnection() {
        return (this.constructor as typeof Model)._connector;
    }
    public static getConnection() {
        return this._connector;
    }

    public static setConnection(client: any): void {
        this._connector = client;
    }

    public static setTableName(name: string): void {
        this._table = name;
    }

    public static getTableName(): string {
        return this._table;
    }

    public set(key: string, value: any): void {
        this[key] = value;
    }

    public async store(additionalData?: any): Promise<any> {
        const attributes = this.attributes();
        const insertionData = { ...attributes, ...additionalData };
        const { data, error, status } = await this.getConnection().from(this._table).insert(insertionData);
        console.log('@MODEL.insert()',data,error,status);
        return this;
    }

    public async overwrite(key: string, value: any): Promise<any> {
        this[key] = value;
        return await this.getConnection().from(current._table).update({ [key]: value }).eq(current._idColumn, this.id);
    }

    public async update(data: any): Promise<any> {
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        const result = await this.getConnection().from(this._table).update(data).eq(this._idColumn, this.id);
        console.log(result);
        return this;
    }

    public async persist(): Promise<any> {
        const attributes = this.attributes();
        const { data, error, status } = await this.getConnection().from(this._table).update(attributes)
            .eq(this._idColumn, this.id);
        return this;
    }

    public static async delete(id: string | number ): Promise<any> {
        const { data, error, status } = await this.getConnection().from(this._table).delete().eq(this._idColumn, id);
        return this;
    }

    public async resetHasMany(relation: string, foreignIdColumn: string,
        distantId: string, data: any, options?: ModelOptions): Promise<any> {

        data = data?.map((item: any) => ({
            [distantId]: item,
            [foreignIdColumn]: this[this._idColumn]
        })
        );

        let response;
        if (options?.rpc) {
            response = await this.getConnection().rpc(options.rpc, { data });
            console.log('RESPONSE using RPC', response);
        } else {
            // Upsert the data
            response = await this.getConnection().from(relation).upsert(data).select();
        }

        // Delete the data that is not in the new data
        if (response?.data?.length) {
            const insertedDistantIds = vertical(response.data, distantId, { serialize_postgres: true });
            const existing = await this.getConnection().from(relation).select(distantId).eq(foreignIdColumn, this[this._idColumn]);

            // Traverse existing data and delete if not in insertedDistantIds
            const toDelete = existing?.data?.filter((item: any) => !insertedDistantIds.includes(item[distantId]));
            if (toDelete && (toDelete.length ?? 0 > 0)) {
                const deleted = await this.getConnection().from(relation).delete().in(distantId, toDelete.map((item: any) => item[distantId]));
            }
        }
        return this;
    }

    public async delete(): Promise<any> {
        return await this.getConnection().from(this._table).delete().eq(this._idColumn, this.id);
    }

    public static async create(data: any): Promise<any> {
        const response = await (this.getConnection()).from(this._table).insert(data).select().single();
        return new this(response);
    }

    public static async find(id: string | number, raw: boolean = false): Promise<any> {
        const { data: profileData, error } = await this.getConnection().from(this._table).select('*').eq(this._idColumn, id).single();
        return this.make(profileData);
    }

    public static async all(options?: DataFetchOptions): Promise<Collection<any>> {
        const data = (await this._connector.from(this._table).select('*')).data;
        return options?.asPlainObject ? data : new Collection(data);
    }


    public static async but(column: string, value: any) {
        const client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
        console.log(
            (this.constructor as typeof Model)._connector,
            Object.getPrototypeOf(this).constructor._connector,
        )
        const { count, error, status, data } = await client.from(this._table).select().neq(column, value);
        return new Collection(data);
    }

    public static async where(column: string, postgresOperator: string, value: any, options?: DataFetchOptions): Promise<Collection<any>> {
        const query = this.getConnection().from(this._table).select('*').filter(column, postgresOperator, value);
        if (options?.orderBy) {
            query.order(options.orderBy, { ascending: options.direction === 'asc' });
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const { count, error, status, data } = await query;
        return new Collection(data);
    }

    public static async only(column: string, value: any): Promise<Collection<any>> {
        const { count, error, status, data } = await this.getConnection().from(this._table).select('*').eq(column, value);

        return new Collection(data);
    }

    public static async edit(id: string | number, data: any): Promise<any> {
        const response = await this._connector.from(this._table).update(data).eq(this._idColumn, id);
        return new this(response);
    }

    public static async first(column: string, whereColumn: string, whereValue: any): Promise<any> {
        const record = await this.getConnection().from(this._table).select(column).eq(whereColumn,whereValue).limit(1).single();
        return record.data[column];
    }

    /**
     * Relationships
     */
    public async whereHas(relation: string, column: string, operator: string, value: any): Promise<any> {
        const current = this.constructor as typeof Model;
        const relationship = this._relations.find((item: any) => item.relation === relation);
        const { data, count, error, status } = await this._connector.from(relationship?.relation)
            .select().eq(relationship?.foreign_column, this[this._idColumn])
            .filter(column, operator, value);
        const modeledData = data ? data?.map((item: any) => new current(item, { count, error, status })) : [];
        return new Collection(modeledData);
    }

    public async getRelated(intermediate: typeof Model, column: string, operator: string, value: any): Promise<any> {
        const constructorObject = this.constructor as typeof Model;
        const relationship = this._relations.find((item: any) => item.relation === intermediate._table);
        const currentModelName = constructorObject.name.toLowerCase();
        const { data, count, error, status } = await constructorObject.getConnection().from(intermediate._table)
            .select(`*, ${currentModelName}: ${constructorObject._table} ( * )`)
            .eq([currentModelName + '_id'], this.id)
            .filter(column, operator, value);
        const modeledData = data ? data?.map((item: any) => new constructorObject(item, { count, error, status })) : [];
        return new Collection(modeledData);
    }

    public async getManyToMany(relation: string, selectColumns: string[] = ['*']): Promise<any> {
        const constructorObject = this.constructor as typeof Model;
        const relationship = this._relations.find((item: any) => item.relation === relation);
        const selectColumnsAsString = relationship.select_columns ? relationship.select_columns.join(', ') : selectColumns.join(', ');
        const query = this.getConnection().from(relationship.relation)
            .select(selectColumnsAsString)
            .eq(relationship.foreign_column, this[this._idColumn]);
        if (relationship.where) {
            for (const clause of relationship.where) {
                const operator = resolveOperator(clause.operator);
                operator.negated ? query.not(clause.column, operator.operator, clause.value) : query.filter(clause.column, operator.operator, clause.value);
            }
        }
        const { data, count, error, status } = await query;
        return new Collection(data);
    }

    // const friendships =  async() => (await supabase.from('friendships')
    //                                                     .select('*, profile:profiles(*)')
    //                                                     .eq('profile_id', user.id)).data;

    public async with(relation: string) {
        const current = this.constructor as typeof Model;

        const _relations = Object.getPrototypeOf(this).constructor._relations;
        const relationship = _relations.find((item: any) => item.relation === relation);

        const { data, count, error, status } = await (this.constructor as typeof Model)._connector.from(relationship?.relation)
            .select().eq(relationship?.foreign_column, this[current._idColumn]);

        const modeledData = data ? data?.map((item: any) => new current(item, { count, error, status })) : [];

        return new Collection(modeledData);
    }

    public static collect(arr: any[]): Collection<any> {
        return new Collection(arr.map((item: any) => new this(item)));
    }

    public plain() {
        return structuredClone(this.attributes());
    }

    public static async make(data: any) {
        const newInstance = await (new this(data)).relate();

        return newInstance;
    }

    public static async from(data: any) {
        return await (new this(data)).relate();
    }
}

