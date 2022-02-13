<script>
    import Image from './Image.svelte';
    import IntersectionObserver from './IntersectionObserver.svelte';
    export let picture = {
        src: '',
        alt: '',
        aspect_ratio: '',
        width: '',
        custom_class: '',
    };
    let nativeLoading = false;
</script>

<IntersectionObserver {picture} let:intersecting>
    {#if intersecting || nativeLoading}
        <Image {picture} />
    {/if}
</IntersectionObserver>
