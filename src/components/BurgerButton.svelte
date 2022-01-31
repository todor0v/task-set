<button class="burger-button">
    <span class="burger-button__lines">
        <span class="burger-button__line" />
        <span class="burger-button__line" />
        <span class="burger-button__line" />
    </span>
</button>

<style type="scss">
    $phone-v: 480px;
    .burger-button {
        --width: 24px;
        --height: 16px;
        position: relative;
        display: none;
        background-color: transparent;
        border: 0;
        justify-self: end;
        cursor: pointer;
        width: var(--width);
        height: var(--height);

        @media (max-width: $phone-v) {
            display: inline-block;
        }
        @media (max-width: $phone-v) {
            margin: 5px;
        }
        .non-touch &:hover,
        &:focus {
            & .burger-button__line {
                background-color: var(--color-primary);
            }
        }
        &__lines {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            z-index: 11;
        }
        &__line {
            position: absolute;
            width: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            top: 0;
            border-bottom: 2px solid;
            border-color: var(--color-primary);
            transition: all 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
            border-radius: 3px;
            &:nth-child(2) {
                position: static;
                margin-top: auto;
                margin-bottom: auto;
                transform: translate(0);
            }
            &:last-child {
                top: 100%;
                transform: translate(-50%, -100%);
            }
        }
        &.is-active &__line {
            top: 50%;
            &:first-child {
                transform: translate(-50%, -100%) rotate(45deg);
            }
            &:nth-child(2n) {
                transform: rotateY(90deg);
            }
            &:last-child {
                transform: translate(-50%, -100%) rotate(-45deg);
            }
        }
    }
</style>
