<script lang="ts">
    import { Popover } from "flowbite-svelte";
    
    export let message: string | undefined = undefined;
</script>

<span class="px-2 ">
    <i id="info-icon" class="bi bi-exclamation-circle-fill"></i>
    <Popover trigger="click" triggeredBy="#info-icon">
        💁 <span class="text-cyan-400">{message}</span>
        <slot/>
    </Popover>
</span>