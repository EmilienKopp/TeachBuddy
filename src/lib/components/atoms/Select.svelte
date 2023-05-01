<script lang="ts">

    type SelectData = {
        option: string;
        id: string;
    };

    export let data: SelectData[] | any[] | undefined = undefined;
    export let value: number | undefined = undefined;
    export let label: string | undefined = undefined;
    export let name: string;
</script>

<div>
    {#if label}
    <label for={name}>
        {label}
    </label>
    {/if}
    <select class="select text-slate-100" {name} bind:value={value} {...$$restProps}>
        {#if data}
            {#each data as item}
                {#if !item.id || !item.option}
                    <option value={item}>{item}</option>
                {:else}
                    <option value={item.id}>{item.option}</option>
                {/if}
            {/each}
        {:else}
            <slot></slot>
        {/if}
    </select>
</div>