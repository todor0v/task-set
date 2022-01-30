<script>
    import { onMount } from 'svelte';
    import auth from '../../authService.js';
    import { isAuthenticated, user } from '../../store.js';
    let auth0Client;
    let toggled = false;
    function login() {
        auth.loginWithPopup(auth0Client);
    }

    function logout() {
        auth.logout(auth0Client);
    }
    onMount(async () => {
        auth0Client = await auth.createClient();

        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
        console.log($user);
    });
</script>

<header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="/#">Task Manager</a>
        <button
            on:click={() => {
                toggled = !toggled;
            }}
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse {toggled === false ? '' : 'show'}" id="navbarText">
            <div class="navbar-nav mr-auto user-details">
                {#if $isAuthenticated}
                    <span class="text-white">{$user.email}</span>
                {:else}<span>&nbsp;</span>{/if}
            </div>
            <span class="navbar-text">
                <ul class="navbar-nav float-right">
                    {#if $isAuthenticated}
                        <li class="nav-item">
                            <button class="nav-link" on:click={logout}>Log Out</button>
                        </li>
                    {:else}
                        <li class="nav-item">
                            <button class="nav-link" on:click={login}>Log In</button>
                        </li>
                    {/if}
                </ul>
            </span>
        </div>
    </nav>
</header>

<style type="scss">
    .navbar-collapse {
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .navbar-collapse.show {
        display: flex;
    }
</style>
