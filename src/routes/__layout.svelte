<script>
    import Footer from '$lib/footer/Footer.svelte';
    import Header from '$lib/header/Header.svelte';
    import '../app.pcss';
</script>

<Header />

<main class="main-content">
    <div class="wrapper">
        <slot />
    </div>
</main>

<Footer />
