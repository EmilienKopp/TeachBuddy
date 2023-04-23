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

{#if label}
<label for={name}>
    {label}
</label>
{/if}
<select class="select" {name} bind:value={value} {...$$restProps}>
    {#if data}
        {#each data as item}
            <option value={item.id}>{item.option}</option>
        {/each}
    {:else}
        <slot></slot>
    {/if}
</select>