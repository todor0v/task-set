<script>
    import { onMount } from 'svelte';
    export let picture = {};
    let loaded = false;
    let thisImage;
    onMount(() => {
        thisImage.onload = () => {
            loaded = true;
        };
    });
</script>

<img src={picture.src} alt={picture.alt} class:loaded bind:this={thisImage} loading="lazy" />

<style>
    img {
        opacity: 0;
        will-change: transform;
    }
    img.loaded {
        opacity: 1;
        transition: opacity var(--transition);
    }
</style>
