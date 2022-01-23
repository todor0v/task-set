<script context="module">
    export const load = async ({ url }) => ({
        props: {
            key: url,
        },
    });
</script>

<script>
    import Footer from '$lib/footer/Footer.svelte';
    import Header from '$lib/header/Header.svelte';
    import { onMount } from 'svelte';
    import '../app.pcss';
    import auth from '../authService.js';
    import { isAuthenticated, user } from '../store.js';

    let auth0Client;

    onMount(async () => {
        auth0Client = await auth.createClient();

        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
    });
</script>

<Header />

<main class="main-content">
    <slot />
</main>

<Footer />
