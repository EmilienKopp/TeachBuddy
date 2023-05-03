<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton';

    export let title: string;

</script>


<AppBar>
	<svelte:fragment slot="lead"></svelte:fragment>
    {title}
	<svelte:fragment slot="trail">(actions)</svelte:fragment>
</AppBar>
