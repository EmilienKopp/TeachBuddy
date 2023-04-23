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
        </AppRail> 
    </svelte:fragment>
    <slot/>

</AppShell>

<!-- <div class="flex flex-row" id="app">
    <Sidebar>
        <div>
            <NavButton>
                <i class="bi bi-house-door-fill"></i>
            </NavButton>
        </div>
        <div>
            <NavButton>
                <i class="bi bi-person-fill"></i>
            </NavButton>
        </div>
        <div>
            <NavButton>
                <i class="bi bi-pen-fill"></i>
            </NavButton>
        </div>
    </Sidebar>
    <main class="flex flex-col flex-grow items-center justify-center">
    <h2 class="bg-darkish w-full text-white text-2xl p-5 border-b border-white"> Welcome ! </h2>
        <slot/>
    </main>
</div> -->
