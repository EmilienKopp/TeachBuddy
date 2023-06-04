import { _ } from 'svelte-i18n';
import { capitalize } from '$lib/helpers/Text';
import { derived } from 'svelte/store';

export const C_ = derived(_, $_ => (str: string) => capitalize($_(str?.toLowerCase())));
export const U_ = derived(_, $_ => (str: string) => $_(str?.toLowerCase()).toLocaleUpperCase());

