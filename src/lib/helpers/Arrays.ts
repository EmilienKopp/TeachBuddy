// @ts-nocheck
export type SelectOptionType = {
	name: string | number;
	value: string | number;
};


export function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function deleteColumn(arr, columnIndex) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].splice(columnIndex, 1);
    }
    return arr;
}

export function mapHeaders(headers,arr) {
  console.log('MAP HEADERS', headers.length, arr.map(el => el.length).find(el => el !== headers.length));
  if(!headers || !arr) throw new Error('mapHeaders requires both headers and array arguments');
  // if(!arr.every(el => el.length === headers.length)) throw new Error('mapHeaders requires headers and array arguments to have the same length');
  return arr.map((row) => {
    let obj = {};
    headers.forEach( (header, index) => {
        obj[header] = row[index];
    });
    return obj;
  });
}

export function toSelectOptions(arr, valueKey, labelKey): SelectOptionType[] | any[] {
  if(!arr) return [];

  return arr.map(el => {
    return {
      value: el[valueKey],
      name: el[labelKey]
    };
  });
}

export function vertical(arr, key) {
  if(!arr) return [];
  
  return arr.map(el => {
    return el[key]
  })
}


type DuplicateCheckOptions = {
  key?: string,
  comparator?: (a: any, b: any) => boolean,
}

export function uniquify(arr, conditions) {
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
  in: (value, array) => {
    return array.includes(value);
  },
  // Check if a value is not in an array
  notIn: (value, array) => {
    return !array.includes(value);
  },
  // Check if a value is equal to another
  equals: (value, other) => {
    return value == other;
  },
  // Check if a value is not null or undefined
  exists: (value) => {
    return value != null;
  },
  // Check if a value is not equal to another
  notEquals: (value, other) => {
    return value != other;
  },
  // Check if a value is greater than another
  greaterThan: (value, other) => {
    return value > other;
  },
  // Check if a value is greater than or equal to another
  greaterThanOrEqual: (value, other) => {
    return value >= other;
  },
  // Check if a value is less than another
  lessThan: (value, other) => {
    return value < other;
  },
  // Check if a value is less than or equal to another
  lessThanOrEqual: (value, other) => {
    return value <= other;
  },
};

