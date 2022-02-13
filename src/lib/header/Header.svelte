<script>
    import { onMount } from 'svelte';
    import auth from '../../authService.js';
    import { clickOutside } from '../../helper/clickOutside';
    // import BurgerButton from '../../components/BurgerButton.svelte';
    import { isAuthenticated,user } from '../../store.js';
    let auth0Client;
    let userToggled = false;

    const login = () => {
        auth.loginWithPopup(auth0Client);
    };

    const logout = () => {
        auth.logout(auth0Client);
    };
    const closePopup = () => {
        userToggled = false;
    };
    onMount(async () => {
        auth0Client = await auth.createClient();

        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
    });
</script>

<header class={$isAuthenticated ? 'main-header main-header--logged-in' : 'main-header'}>
    <div class="wrapper">
        <div class="main-header__content">
            <a class="brand" sveltekit:prefetch href="/">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                    <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="#6088c7" stroke-miterlimit="10" stroke-width="32" />
                    <path fill="none" stroke="#e78632" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 192L256.13 320l-47.95-48M191.95 320L144 272M305.71 192l-51.55 59" />
                </svg>
                <span class="brand__text">TaskSet</span>
            </a>
            <!-- <BurgerButton /> -->
            <nav class="main-nav" aria-label="Main Menu">
                <h2 class="visuallyhidden">Main Menu</h2>
                <ul class="main-nav__list" role="menubar" aria-hidden="false">
                    {#if $isAuthenticated}
                        <li class="main-nav__item main-nav__item--sub" use:clickOutside on:click_outside={closePopup}>
                            <button class="user" on:click={() => {userToggled = !userToggled}}>
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="user__icon">
                                    <circle cx="24" cy="12" r="8" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <ul class="main-subnav" class:is-active={userToggled}>
                                <li class="main-subnav__item">
                                    <button class="main-nav__link main-nav__link--button" on:click={logout}>Log Out</button>
                                </li>
                            </ul>
                        </li>
                    {:else}
                        <li class="main-nav__item">
                            <button class="main-nav__link main-nav__link--button" on:click={login}>Log In</button>
                        </li>
                    {/if}
                </ul>
                <!-- <div class="collapse navbar-collapse"  id="navbarText">
                    <div class="navbar-nav mr-auto user-details">
                        {#if $isAuthenticated}
                            <span class="text-white">{$user.email}</span>
                        {:else}<span>&nbsp;</span>{/if}
                    </div>
                    <span class="navbar-text">
                        <ul class="navbar-nav float-right">

                        </ul>
                    </span>
                </div> -->
            </nav>
        </div>
    </div>
</header>

<style type="scss">
    .main-header {
        padding: 10px 0;
        margin-bottom: 40px;
        &__content {
            display: flex;
            align-items: center;
        }
        &--logged-in {
            margin-bottom: 80px;
        }
    }
    .main-nav {
        margin-left: auto;
        &__list {
            padding: 0;
        }
        &__item {
            list-style: none;
        }
        &__item--sub {
            position: relative;
        }
        &__link--button {
            font-size: 20px;
            white-space: nowrap;
            color: var(--color-grey-1);
            cursor: pointer;
            transition: background-color var(--transition);
            border: 1px solid var(--color-grey-2);
            background-color: var(--color-white);
            border-radius: 6px;
            padding: 4px 14px 4px;
            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background-color: var(--color-grey-3);
                }
            }
        }
        &__link--button:focus {
            background-color: var(--color-grey-3);
        }
    }
    .main-subnav {
        position: absolute;
        right: 0;
        visibility: hidden;
        opacity: 0;
        transform: translateY(-5px);
        transition: opacity var(--transition), transform var(--transition), visibility var(--transition);
        padding: 0;
        top: calc(100% + 8px);
        &.is-active {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
        }
        &__item {
            list-style: none;
        }
    }
    .brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        .icon {
            flex-shrink: 0;
            width: 55px;
            height: 55px;
            margin-left: -5px;
        }
        &__text {
            color: var(--color-grey-1);
            margin-left: 2px;
            font-size: 20px;
            margin-top: 5px;
        }
    }
    .user {
        border-radius: 50%;
        border: 2px solid var(--color-grey-1);
        overflow: hidden;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        cursor: pointer;
        &__icon {
            width: 40px;
            height: 40px;
            margin-bottom: -7px;
            circle,
            path {
                stroke: var(--color-grey-1);
            }
        }
    }
</style>
