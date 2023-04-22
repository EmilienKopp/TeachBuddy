<script lang="ts">
    export let name: string;
    export let type: string = 'text';
    export let required: boolean = false;
    export let label: string = name;
    export let placeholder: string = name;
    export let value: string = '';
</script>


<div class="mt-1">
    {#if label != ''}
    <label for={name} class="block text-sm font-medium text-gray-700" >
        {label}
    </label>
    {/if}
    <input
        {type}
        {name}
        {required}
        {placeholder}
        {value}
        class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
</div>