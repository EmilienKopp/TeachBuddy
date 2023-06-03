<script lang='ts'>
	import { invalidate } from '$app/navigation';
	import '$lib/styles/global.css';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { locale } from 'svelte-i18n';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
		if (_session?.expires_at !== session?.expires_at) {
			invalidate('supabase:auth');
		}
		});

		return () => subscription.unsubscribe();
	});

	$: console.log('Locale set to:',$locale);
</script>

<div class="h-full w-full dark:text-white text-black font-raleway overflow-scroll">
	<slot />
</div>

