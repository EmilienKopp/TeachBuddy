import { expect, test } from '@playwright/test';

import { Collection } from '$lib/models/Collection';

test('Collection.remove can delete several elements by value', async ({ page }) => {
	const stringCollection = new Collection(['a', 'b', 'c', 'c', 'c', 'c', 'g', 'h', 'i', 'j']);
	const numberCollection = new Collection([1, 2, 3, 3, 3, 3, 7, 8, 9, 10]);
	const objectCollection = new Collection([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
		{ id: 3, name: 'c' },
		{ id: 3, name: 'c' },
		{ id: 3, name: 'c' },
	]);

	const stringCollectionResult = stringCollection.remove('c', { all: true });
	const numberCollectionResult = numberCollection.remove(3, { noIndex: true, all: true });
	const objectCollectionResult = objectCollection.remove({ id: 3 }, { noIndex: true, all: true });

	expect(stringCollectionResult).toEqual(['a', 'b', 'g', 'h', 'i', 'j']);
	expect(numberCollectionResult).toEqual([1, 2, 7, 8, 9, 10]);
	expect(objectCollectionResult).toEqual([
		{ id: 1, name: 'a' },
		{ id: 2, name: 'b' },
	]);
});