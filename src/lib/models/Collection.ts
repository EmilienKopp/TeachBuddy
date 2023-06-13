

export class Collection<T> extends Array {

    constructor (
            data: any[] | { [x: string]: any; }[] | null = [], 
            model?: new (...args: any[]) => T 
    ) {
        data = data ?? [];
        if(model) {
            data = data.map(el => new model(el));
        }
        super(...data);
    }

    // Overriding the default behavior of methods like `map` by returning the built-in Array class as the constructor.
    static get [Symbol.species]() { return Array; }

    public vertical (key: string): any[] {
        let result: any[] = [];
        this.forEach(el => {
            result.push(el[key])
        });
        return this.constructor(result);
    }

    public toArray(): any[] {
        return this;
    }

    public plain(): any[] {
        if(!this || !this.length) return [];
        
        return this.map(el => JSON.parse(JSON.stringify(el)));
    }

    public toSelectOptions (valueKey: string, labelKey: string): any[] {
        return this.map(el => {
            return {
                value: el[valueKey],
                name: el[labelKey],
            };
        });
    }

    public count() {
        return this.length ?? 0;
    }

}