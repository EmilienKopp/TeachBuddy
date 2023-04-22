<script>
    import '$lib/styles/global.css';
    import NavButton from '$lib/components/atoms/NavButton.svelte';
    import Sidebar from '$lib/components/organisms/Sidebar.svelte';
</script>

<div class="flex flex-row" id="app">
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
    <main class="flex flex-col flex-grow items-center justify-center">
    <h2 class="bg-darkish w-full text-white text-2xl p-5 border-b border-white"> Welcome ! </h2>
        <slot/>
    </main>
</div>
