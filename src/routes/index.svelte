<script>
    import { onMount } from 'svelte';
    import auth from '../authService.js';
    import TaskItem from '../components/TaskItem.svelte';
    import { error, isAuthenticated, user } from '../store.js';
    let auth0Client;
    let user_tasks = [];
    let newTask;

    $: if ($user && $user.name) {
        getTasks($user);
    }

    onMount(async () => {
        auth0Client = await auth.createClient();
        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
    });

    function login() {
        auth.loginWithPopup(auth0Client);
    }

    function handleKeypress(e) {
        if (e.key === 'Enter') addItem();
    }

    async function getTasks(user) {
        try {
            const res = await fetch(`/todos/${user?.name}.json`);
            user_tasks = await res.json();
        } catch (_error) {
            console.error(_error);
        }
    }

    async function addItem() {
        if (newTask) {
            await fetch('/todos.json', {
                method: 'POST',
                headers: { accept: 'text/plain' },
                body: JSON.stringify({ description: newTask, completed: false, user: $user.email }),
            });

            const updatedTasks = await fetch(`/todos/${$user.name}.json`);
            const updatedTasksData = await updatedTasks.json();
            user_tasks = updatedTasksData;
            newTask = '';
            $error.text = '';
        } else {
            $error.text = 'You cannot create an empty task';
        }
    }
</script>

<svelte:head>
    <title>TaskSet: Todo list app</title>
</svelte:head>

<!-- Application -->
{#if !$isAuthenticated}
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-10 offset-md-1">
                <div class="jumbotron">
                    <h1 class="display-4">Task Management made Easy!</h1>
                    <p class="lead">Instructions</p>
                    <ul>
                        <li>Login to start &#128272;</li>
                        <li>Create Tasks &#128221;</li>
                        <li>Tick off completed tasks &#9989;</li>
                    </ul>
                    <a class="btn btn-primary btn-lg mr-auto ml-auto" href="/#" role="button" on:click={login}>Log In</a>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="container" id="main-application">
        <div class="row">
            <div class="col-md-6">
                <ul class="list-group">
                    {#each user_tasks as item}
                        <TaskItem task={item} />
                    {/each}
                </ul>
            </div>
            <div class="col-md-6">
                <input class="form-control" bind:value={newTask} on:keypress={handleKeypress} placeholder="Enter New Task" />
                {#if $error.text}
                    <p class="error">{$error.text}</p>
                {/if}
                <br />
                <button type="button" class="btn btn-primary" on:click={addItem}>Add Task</button>
            </div>
        </div>
    </div>
{/if}
