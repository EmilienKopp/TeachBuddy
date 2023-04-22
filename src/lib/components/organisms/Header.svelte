<script>
    import Checkbox from '../components/Checkbox.svelte';
    import { resource, displayRightPanel } from "../stores.js";
    import { USER} from "../users.js";
    
    let ModelName;
    let guest = true;
    
    
    
    $ : $resource.name = ModelName;
    </script>
    
    
    
    <!-- /** HEADER **/-->
    <div id="header" class="flex flex-row w-full h-12 max-h-12 items-center justify-between gap-5 py-2 px-5 border-b border-darkish">
        <div class="-ml-2 flex items-center text-sm">
            Welcome to
            <span class="font-bold text-blue-500 mx-3">BlueprintFactory</span>,
            {guest ? 'Guest' : $USER.username}
            <span class="mr-4 ml-1 place-self-end text-xs text-slate-400">v0.1.0</span>
            <input bind:value="{ModelName}" on:change={ () => { console.log($resource)} }  name="ModelName" class="animate-pulse p-2 w-60 h-9 bg-black border-darkish border-2 text-slate-400" placeholder="Type your model name here"/>
            <Checkbox label="Show Right Panel" bind:checked={$displayRightPanel}/>
        </div>
        <div class="flex flex-row items-center">
            <span class="mr-3 text-xs">Powered by: </span> 
            <a href="https://svelte.dev" target="_blank">
                <img width=25 alt="Svelte" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" />
            </a>
        </div>
        
    </div>