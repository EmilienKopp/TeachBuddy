<script>
    import '$lib/styles/global.css';
    import NavButton from '$lib/components/atoms/NavButton.svelte';
    import Sidebar from '$lib/components/organisms/Sidebar.svelte';
</script>

<div class="flex h-full flex-col" id="app">
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
            <NavButton href="/app/generator">
                <i class="bi bi-pen-fill"></i>
            </NavButton>
        </div>
    </Sidebar>
    <div class="flex h-full">
        <slot/>
    </div>

</div>
