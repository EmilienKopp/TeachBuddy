<script lang="ts">
    import { Button } from 'flowbite-svelte';

    export let tainted: boolean | any = false;
    export let color: any = 'cyanToBlue';
    export let type: string = 'button';
    export let shadow: any = 'teal';

</script>

<div class="fixed bottom-6 right-6 md:static">
    <div class="flex flex-col items-end">
        {#if !!tainted}<span class="animate-bounce self-center text-2xl">👇</span>{/if}
        <Button {type} gradient {color} {shadow} {...$$restProps}>保存・Save</Button>
    </div>
</div>