<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { confetti } from '@neoconfetti/svelte';
    import { GradientButton, Modal } from 'flowbite-svelte';
    export let data: PageData;

    let incomingPassage: any;
    let generatorFinishedAlert: boolean = false;

    onMount( () => {
        console.log('Listening to changes...');
        data.supabase.channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'passages' }, (payload: any) => {
                console.log('Change received!', payload);
                incomingPassage = payload.new;
                generatorFinishedAlert = true;
            }).subscribe()
    })

</script>


{#if generatorFinishedAlert}
<div
	style="position: absolute; left: 50%; top: 30%"
	use:confetti={{
		force: 0.3,
		stageWidth: window.innerWidth,
		stageHeight: window.innerHeight,
		colors: ['#ff3e00', '#40b3ff', '#676778']
	}}>
	
</div>
{/if}
<Modal bind:open={generatorFinishedAlert} autoclose>
    <div class="flex flex-col">
        <h1 class="text-lg font-bold mt-4">🎉 Your text is ready! 文章が出来上がり！</h1>
        <GradientButton color="teal" class="mt-4" href="/app/library/{incomingPassage.id}" on:click={() => generatorFinishedAlert = false}>See it・見る</GradientButton>
        <GradientButton color="pink" class="mt-4" on:click={() => generatorFinishedAlert = false}>Later・あとで</GradientButton>
    </div>
</Modal>
<span id="thepixel" class="absolute bottom-0 left-0">.</span>