<script lang="ts">
    import '$lib/styles/global.css';
    import { writable, type Writable} from 'svelte/store';
    import NavButton from '$lib/components/atoms/NavButton.svelte';
    import { AppShell, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
    import { Scaffolder } from '/src/config/scaffolder';
    import { page } from '$app/stores';

    const storeValue: Writable<number> = writable(0);
    
    

</script>


<AppShell>

    <svelte:fragment slot="header">  </svelte:fragment>
    <svelte:fragment slot="sidebarLeft"> 
        <AppRail>
            {#each Scaffolder.AppRail.Tiles as tile, index}
                <AppRailTile    value={index} tag="a" href={tile.href} label={tile.label} 
                                class="{tile.href === $page.url.pathname ? '!bg-primary-500' : ''}">
                    <i class="bi {`bi-${tile.icon}`} text-3xl"></i>
                </AppRailTile>
            {/each}

            <AppRailTile slot="trail" label="Sign Out" on:click={ () => {$page.data.supabase.auth.signOut()}}>
                <i class="bi {`bi-box-arrow-left`} text-3xl"></i>
            </AppRailTile>
        </AppRail> 
    </svelte:fragment>
    <slot/>

</AppShell>