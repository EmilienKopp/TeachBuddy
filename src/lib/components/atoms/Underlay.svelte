<script lang="ts">
    export let color: string = 'white';
    export let opacity: number | string = '50';
    export let extraClasses: string = '';
</script>

<div class="bg-{color} bg-opacity-{opacity} p-2 rounded {extraClasses}">
    <slot />
</div>