<script>
    import { onMount } from 'svelte';
    export let picture = {
        aspect_ratio: '',
        width: '',
        custom_class: '',
    };
    const rootMarginObj = { top: 10, bottom: 0, left: 0, right: 0 };
    const once = true;
    let intersecting = false;

    let container;
    onMount(() => {
        if (typeof IntersectionObserver !== 'undefined') {
            const rootMargin = `${rootMarginObj.bottom}px ${rootMarginObj.left}px ${rootMarginObj.top}px ${rootMarginObj.right}px`;
            const observer = new IntersectionObserver(
                (entries) => {
                    intersecting = entries[0].isIntersecting;
                    if (intersecting && once) {
                        observer.unobserve(container);
                    }
                },
                {
                    rootMargin,
                }
            );
            observer.observe(container);
            return () => observer.unobserve(container);
        }
    });
</script>

<picture class="aspect-ratio {picture.custom_class}" style="--aspect-ratio:{picture.aspect_ratio};--width:{picture.width}" bind:this={container}>
    <slot {intersecting} />
</picture>
