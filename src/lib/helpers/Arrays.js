// @ts-nocheck

export function deleteColumn(arr, columnIndex) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].splice(columnIndex, 1);
    }
    return arr;
}

export function mapHeaders(headers,arr) {
  if(!headers || !arr) throw new Error('mapHeaders requires both headers and array arguments');
  if(!arr.every(el => el.length === headers.length)) throw new Error('mapHeaders requires headers and array arguments to have the same length');
  return arr.map((row) => {
    let obj = {};
    headers.forEach( (header, index) => {
        obj[header] = row[index];
    });
    return obj;
  });
}

export function toSelectOptions(arr, valueKey, labelKey) {
  console.log('arr', arr);
  return arr.map(el => {
    return {
      value: el[valueKey],
      label: el[labelKey]
    }
  });
}