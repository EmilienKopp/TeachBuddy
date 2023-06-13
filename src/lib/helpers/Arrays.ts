import type { SelectOptionType } from 'flowbite-svelte/dist/types';
import { _ } from 'svelte-i18n';

type DuplicateCheckOptions = {
  key?: string,
  comparator?: (a: any, b: any) => boolean,
}

export function random(arr: Array<any>): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function deleteColumn(arr: Array<any>, columnIndex: number) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].splice(columnIndex, 1);
  }
  return arr;
}

export function mapHeaders(headers: Array<any>, arr: Array<any>) {
  if (!headers || !arr) throw new Error('mapHeaders requires both headers and array arguments');
  // if(!arr.every(el => el.length === headers.length)) throw new Error('mapHeaders requires headers and array arguments to have the same length');
  return arr.map((row) => {
    let obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

export function toSelectOptions(arr: Array<any>, valueKey: string, labelKey: string,
  formatter: Function | null = null,
  concatColumn: string | null = null,
  concatPrefix: string = ''): SelectOptionType[] | any[] {
  if (!arr) return [];

  return arr.map(el => {
    let name = formatter ? formatter(el[labelKey]) : el[labelKey];
    if (concatColumn) name += (concatColumn && el[concatColumn]) ? ` (${concatPrefix} ${el[concatColumn]})` : '';
    return {
      value: el[valueKey],
      name,
    };
  });
}


type VerticalOptions = {
  serialize_postgres?: boolean,
}

export function vertical(arr: Array<any>, key: string | number, options?: VerticalOptions): Array<any> | string {
  if (!arr) return [];

  const verticalized = arr.map(el => { return el[key] })

  if(options?.serialize_postgres)
    return '(' + verticalized.join(', ') + ')';


  return verticalized;
}

export function uniquify(arr: Array<any>, conditions: Array<any>): Array<any> {
  const seen = new Set();

  return arr.filter(item => {
    const conditionResults = conditions.map(condition => {
      const { key, value, operation } = condition;

      if (operation === '==') {
        return item[key] == value;
      } else if (operation === '!=') {
        return item[key] != value;
      }
    });

    // Check if all conditions are met (return true for AND)
    const allConditionsMet = conditionResults.every(result => result);

    if (allConditionsMet && !seen.has(item[conditions[0].key])) {
      seen.add(item[conditions[0].key]);
      return true;
    }

    return false;
  });
}

export const Policies = {
  // Check if a value is in an array
  in: (value: any, array: string | any[]) => {
    return array.includes(value);
  },
  // Check if a value is not in an array
  notIn: (value: any, array: string | any[]) => {
    return !array.includes(value);
  },
  // Check if a value is equal to another
  equals: (value: any, other: typeof value) => {
    return value == other;
  },
  // Check if a value is not null or undefined
  exists: (value: any) => {
    return value != null;
  },
  // Check if a value is not equal to another
  notEquals: (value: any, other: typeof value) => {
    return value != other;
  },
  // Check if a value is greater than another
  greaterThan: (value: any, other: typeof value) => {
    return value > other;
  },
  // Check if a value is greater than or equal to another
  greaterThanOrEqual: (value: any, other: typeof value) => {
    return value >= other;
  },
  // Check if a value is less than another
  lessThan: (value: any, other: typeof value) => {
    return value < other;
  },
  // Check if a value is less than or equal to another
  lessThanOrEqual: (value: any, other: typeof value) => {
    return value <= other;
  },
};
