<!-- Login.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../atoms/Button.svelte";
	import TextInput from "../molecules/inputs/TextInput.svelte";
	import EmailInput from "../molecules/inputs/EmailInput.svelte";
	import PasswordInput from "../molecules/inputs/PasswordInput.svelte";
	import { FORMS } from "$lib/config/forms";

    export let email = "";
    export let password = "";
    let emailError: string;
    let passwordError: string;
    let hasPasswordRequestRoute = false;
    export let endpoint: string = "/login";
    export let form: any;

</script>

