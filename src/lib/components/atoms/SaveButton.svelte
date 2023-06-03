<script lang="ts">
    import { Button, GradientButton, Spinner } from 'flowbite-svelte';

    export let tainted: boolean | any = false;
    export let color: any = 'cyanToBlue';
    export let type: string = 'button';
    export let shadow: any = 'teal';
    export let loading: boolean = false;

</script>

<div class="fixed bottom-6 right-6 md:static md:mt-4">
    <div class="flex flex-col items-end">
        {#if !!tainted}<span class="animate-bounce self-center sm:self-end sm:mr-12 text-2xl">👇</span>{/if}
        <GradientButton {type} gradient {color} {shadow} {...$$restProps}>
            {#if loading}
                <Spinner class="w-5 h-5 mr-2" size="5"/>
            {/if}
            保存・Save
        </GradientButton>
    </div>
</div>