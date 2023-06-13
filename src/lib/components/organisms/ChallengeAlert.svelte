<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { confetti } from '@neoconfetti/svelte';
    import { GradientButton, Modal } from 'flowbite-svelte';

    export let data: PageData;

    let challengedAlert: boolean = false;
    let challengeContent: string = "";

    onMount( () => {
        console.log('Listening to changes...', data);
        data.supabase.channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'challenges', filter: "challengee_id=eq."+ data.session.user.id }, (payload: any) => {
                console.log('Change received!', payload);
                challengeContent = payload.new.passage_id ?? payload.new.sverdle_word;
                challengedAlert = true;
                
            }).subscribe()
    })

</script>


{#if challengedAlert}
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
<Modal bind:open={challengedAlert} autoclose>
    <div class="flex flex-col">
        <h1 class="text-lg font-bold mt-4">New challenge incoming! </h1>
        <GradientButton color="teal" class="mt-4" href="/app/sverdle?wordId={challengeContent}" on:click={() => challengedAlert = false}>See it・見る</GradientButton>
        <GradientButton color="pink" class="mt-4" on:click={() => challengedAlert = false}>Later・あとで</GradientButton>
    </div>
</Modal>
<span id="thepixel" class="absolute bottom-0 left-0">.</span>