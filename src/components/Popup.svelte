<script>
    import { fly } from 'svelte/transition';
    export let info_text = "", text = "", button = false, buttonAction;
</script>

<div class="popup-box" in:fly={{ y: 200, duration: 400 }} out:fly={{ y: 200, duration: 600 }}>
    {#if info_text}
        <span class="popup-box__text">{info_text}</span>
    {/if}

    {#if button}
        <button class="popup-box__button" on:click={buttonAction}>{text}</button>
    {:else}
        <span class="popup-box__button">{text}</span>
    {/if}
</div>

<style type="scss">
    .popup-box {
        display: flex;
        align-items: center;
        gap: 10px 14px;
        position: fixed;
        z-index: 20;
        left: 50%;
        will-change: transform;
        transform: translateX(-50%);
        bottom: 40px;
        &__button {
            background-color: var(--color-grey-3);
            border: 1px solid var(--color-grey-2);
            padding: 7px 10px 6px;
            border-radius: 6px;
        }
    }
    button.popup-box__button {
        cursor: pointer;
    }
</style>