<script lang='ts'>
	import { invalidate } from '$app/navigation';
	import '$lib/styles/global.css';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

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

</script>

<div class="bg-gray-800 h-full w-full text-white font-raleway">
	<slot />
</div>
