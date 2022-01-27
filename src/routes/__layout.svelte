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
    import '../app.pcss';
</script>

<Header />

<main class="main-content">
    <slot />
</main>

<Footer />
