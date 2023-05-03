<script lang="ts">

    type SelectData = {
        option: string;
        id: string;
    };

    export let data: SelectData[] | any[] | undefined = undefined;
    export let value: number | undefined = undefined;
    export let label: string | undefined = undefined;
    export let name: string;
    export let extraClass: string | string[] | undefined = undefined;
</script>

<div class="my-2 flex flex-col max-w-fit">
    {#if label}
    <label for={name}>
        {label}
    </label>
    {/if}
    <select class="bg-darkish rounded-3xl text-slate-100 w-[25ch]  {extraClass}" {name} bind:value={value} {...$$restProps}>
        {#if data}
            {#each data as item}
                {#if !item.value || !item.label}
                    <option value={item}>{item}</option>
                {:else}
                    <option value={item.value}>{item.label}</option>
                {/if}
            {/each}
        {:else}
            <slot></slot>
        {/if}
    </select>
</div>