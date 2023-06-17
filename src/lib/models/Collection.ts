import type { SelectOptionType } from "flowbite-svelte/dist/types";
import { toSelectOptions } from "$lib/helpers/Arrays";

export class Collection<T> extends Array {

    constructor(
        data: any[] | { [x: string]: any; }[] | null = [],
        model?: new (...args: any[]) => T
    ) {
        data = data ?? [];
        if (model) {
            data = data.map(el => new model(el));
        }
        super(...data);
    }

    // Overriding the default behavior of methods like `map` by returning the built-in Array class as the constructor.
    static get [Symbol.species]() { return Array; }

    [Symbol.iterator](): IterableIterator<T> {
        let index = 0;
        return {
            next: (): IteratorResult<T> => {
                if (index < this.length) {
                    const value = this[index];
                    index++;
                    return { value, done: false };
                } else {
                    return { done: true, value: undefined };
                }
            },
            [Symbol.iterator]() {
                return this;
            }
        };
    }

    /** OVERRIDES **/
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): Collection<U> {
        const mapped = super.map(callbackfn, thisArg);
        return new Collection(mapped);
    }

    filter<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): Collection<U> {
        const filtered = super.filter(callbackfn, thisArg);
        return new Collection(filtered);
    }

    public vertical(key: string): any[] {
        let result: any[] = [];
        this.forEach(el => {
            result.push(el[key])
        });
        return new Collection(result);
    }

    public toArray(): any[] {
        return this;
    }

    public plain(): any[] {
        if (!this || !this.length) return [];
        return Array.from(this).map(el => JSON.parse(JSON.stringify(el)));
    }

    public toSelectOptions(valueKey: string, labelKey: string,
        formatter: Function | null = null,
        concatColumn: string | null = null,
        concatPrefix: string = ''): SelectOptionType[] | any[] {
        return toSelectOptions(this,valueKey, labelKey, formatter, concatColumn, concatPrefix);
      }

    public count() {
        return this.length ?? 0;
    }

    public first() {
        return this[0] ?? null;
    }

    /**
     * Improvement on 'splice' to allow for removing an element by value instead of index (deep comparison)
     * @param elementOrIndex If an index, perform a regular Array.splice. If an element, remove the first match (deep comparison).
     * @param options.noIndex If true, remove the element by value instead of index (user if looking for a match on a numerical value instead of an index)
     * @param options.all If true, remove all matches instead of just the first
     * @returns Collection<T>
     */
    public remove(elementOrIndex: any, options: { noIndex?: boolean, all?: boolean, depth?: number} | null = null): Collection<T> {
        if (!elementOrIndex) return this;

        if (typeof elementOrIndex === 'number' && !options?.noIndex) {
            this.splice(elementOrIndex, 1);
        } if (typeof elementOrIndex === 'object') {
            if(Object.keys(this).includes('id')) 
                elementOrIndex = this.find(el => el.id === (elementOrIndex as any).id);

            // Make one level deep comparison of objects and remove the first match, working with native types as well
            let index;
            do {
                index = this.findIndex(el => JSON.stringify(el) === JSON.stringify(elementOrIndex)); 
                if (index === -1) break;
                this.splice(index, 1);
            } while (options?.all && index > -1)
    
        } else {
            while(this.includes(elementOrIndex)) {
                this.splice(this.indexOf(elementOrIndex), 1);
            }
        }
        return this;
    }

}