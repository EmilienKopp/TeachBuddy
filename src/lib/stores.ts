import { writable, type Writable } from "svelte/store";

export const pointStore = writable(0);

export const vocabularyStore: Writable<Array<any>> = writable();