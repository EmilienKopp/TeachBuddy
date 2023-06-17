import { describe, expect, it, test } from 'vitest';

import { Collection } from '$lib/models/Collection';

let stringCollection: Collection<string>;
let numberCollection: Collection<number>;
let objectCollection: Collection<any>;
let objectCollectionWithoutID: Collection<any>;
let nestedObjectCollection: Collection<any>;
let stringCollectionWithDuplicates: Collection<string>;
let numberCollectionWithDuplicates: Collection<number>;
let objectCollectionWithDuplicates: Collection<any>;
let nestedObjectCollectionWithDuplicates: Collection<any>;


test('Collection.count() test', () => {
	init();
	expect(stringCollection.count()).toBe(3);
	expect(numberCollection.count()).toBe(3);
	expect(objectCollection.count()).toBe(3);
});

test('Collection.vertical() should return vertical arrays', () => {
	init();
	const verticalOnId = objectCollection.vertical('id');
	const verticalOnName = objectCollection.vertical('name');
	expect(verticalOnId).toEqual([1, 2, 3]);
	expect(verticalOnName).toEqual(['a', 'b', 'c']);
});

test('Collection.filter() should filter the collection', () => {
	init();
	const stringCollectionResult = stringCollection.filter((element: any) => element === 'a');
	const numberCollectionResult = numberCollection.filter((element: any) => element > 1);
	const objectCollectionResult = objectCollection.filter((element: any) => element.id === 1);
	expect(stringCollectionResult).toEqual(['a']);
	expect(numberCollectionResult).toEqual([2,3]);
	expect(objectCollectionResult).toEqual([{ id: 1, name: 'a' }]);
});

test('Collection.map() should perform map operations', () => {
	init();
	const stringCollectionResult = stringCollection.map((element: any) => element.toUpperCase());
	const numberCollectionResult = numberCollection.map((element: any) => element * 2);
	const objectCollectionResult = objectCollection.map((element: any) => {
		return {
			value: element.id,
			name: element.name,
		};
	});
	
	expect(stringCollectionResult).toEqual(['A', 'B', 'C']);
	expect(numberCollectionResult).toEqual([2, 4, 6]);
	expect(objectCollectionResult).toEqual([
		{ value: 1, name: 'a' },
		{ value: 2, name: 'b' },
		{ value: 3, name: 'c' },
	]);
});

test('Collection.plain() should return a POJO array', () => {
	class TestClass {
		constructor(public id: number, public name: string) {}
	}

	const nonNativeObjectCollection = new Collection([
		new TestClass(1, 'a'),
		new TestClass(2, 'b'),
		new TestClass(3, 'c'),
	])

	const nonNativeObjectCollectionResult = nonNativeObjectCollection.plain();
	expect(nonNativeObjectCollection instanceof Collection).toBe(true);
	expect(nonNativeObjectCollection.every( (el:any) => el instanceof TestClass)).toBe(true);
	expect(nonNativeObjectCollectionResult instanceof Array).toBe(true);
	expect(nonNativeObjectCollectionResult instanceof Collection).toBe(false);
	expect(nonNativeObjectCollectionResult.every( (el:any) => el instanceof TestClass )).toBe(false);
});

test('Collection.remove() should remove given element', () => {
	init();
	const stringCollectionResult = stringCollection.remove('c', );
	const numberCollectionResult = numberCollection.remove(3, { noIndex: true });
	const objectCollectionResult = objectCollection.remove({ id: 3, name: 'c' });
	const objectCollectionWithoutIDResult = objectCollectionWithoutID.remove({ name: 'a', rank: 'd' });
	const nestedObjectCollectionResult = nestedObjectCollection.remove({ id: 3, name: 'c', nested: { id: 3, rank: 'f' } });
	expect(stringCollectionResult).toEqual(['a','b']);
	expect(numberCollectionResult).toEqual([1, 2]);
	expect(objectCollectionResult).toEqual([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
	]);
	expect(objectCollectionWithoutIDResult).toEqual([
		{ name: 'b', rank: 'e' },
		{ name: 'c', rank: 'f' },
	]);
	expect(nestedObjectCollectionResult).toEqual([
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
	]);
});

test('Collection.remove() --all should remove all duplicate elements', () => {
	init();
	const stringCollectionResult = stringCollectionWithDuplicates.remove('c', { all: true });
	const numberCollectionResult = numberCollectionWithDuplicates.remove(3, { noIndex: true, all: true });
	const objectCollectionResult = objectCollectionWithDuplicates.remove({ id: 3, name: 'c' }, { all: true });
	const nestedObjectCollectionResult = nestedObjectCollectionWithDuplicates.remove({ id: 3, name: 'c', nested: { id: 3, rank: 'f' } }, { all: true });
	expect(stringCollectionResult).toEqual(['a','b','a','b']);
	expect(numberCollectionResult).toEqual([1, 2, 1, 2]);
	expect(objectCollectionResult).toEqual([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
	]);
	expect(nestedObjectCollectionResult).toEqual([
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
	]);
});

function init() {
	stringCollection = new Collection(['a', 'b', 'c']);
	numberCollection = new Collection([1, 2, 3]);
	objectCollection = new Collection([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 3, name: 'c' },
	]);
	objectCollectionWithoutID = new Collection([
		{ name: 'a' , rank: 'd' },
		{ name: 'b' , rank: 'e' },
		{ name: 'c' , rank: 'f' },
	]);
	nestedObjectCollection = new Collection([
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
		{ id: 3, name: 'c', nested: { id: 3, rank: 'f' } },
	]);

	stringCollectionWithDuplicates = new Collection(['a', 'b', 'c', 'a', 'b', 'c']);
	numberCollectionWithDuplicates = new Collection([1, 2, 3, 1, 2, 3]);
	objectCollectionWithDuplicates = new Collection([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 3, name: 'c' },
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 3, name: 'c' },
	]);
	nestedObjectCollectionWithDuplicates = new Collection([
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
		{ id: 3, name: 'c', nested: { id: 3, rank: 'f' } },
		{ id: 1, name: 'a', nested: { id: 1, rank: 'd' } },
		{ id: 2, name: 'b', nested: { id: 2, rank: 'e' } },
		{ id: 3, name: 'c', nested: { id: 3, rank: 'f' } },
	]);
}