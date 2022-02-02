<script>
    import { onMount } from 'svelte';
    import auth from '../authService.js';
    import TaskItem from '../components/TaskItem.svelte';
    import { error, isAuthenticated, newTask, tasks, user } from '../store.js';
    let auth0Client;
    let taskInput;

    $: if ($user && $user.name) {
        getTasks($user);
    }

    onMount(async () => {
        auth0Client = await auth.createClient();
        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
    });

    const login = () => {
        auth.loginWithPopup(auth0Client);
    };

    const handleKeypress = (e) => {
        if (e.key === 'Enter') addItem();
    };

    async function getTasks(user) {
        try {
            const res = await fetch(`/todos/${user?.name}.json`);
            $tasks = await res.json();
        } catch (_error) {
            console.error(_error);
        }
    }

    async function addItem() {
        if ($newTask) {
            taskInput.value = '';
            const updatedTask = await fetch('/todos.json', {
                method: 'POST',
                headers: { accept: 'text/plain' },
                body: JSON.stringify({ description: $newTask, completed: false, user: $user.email }),
            });
            const updatedTaskData = await updatedTask.json();
            $tasks = [...$tasks, updatedTaskData];
            $error.text = '';
            $newTask = '';
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
    <!-- <a class="btn btn-primary btn-lg mr-auto ml-auto" href="/" role="button" on:click={login}>Log In</a> -->
{:else}
    <div class="task-form">
        <div class="task-form__box">
            <input class="task-form__input" bind:value={$newTask} bind:this={taskInput} on:keypress={handleKeypress} placeholder="What do you want to do?" />
            <button type="button" class="task-form__button" on:click={addItem} aria-label="Add Task">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                    <title>Add</title>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112" />
                </svg>
            </button>
        </div>
        {#if $error.text}
            <p class="error">{$error.text}</p>
        {/if}
    </div>
    {#if $tasks.length}
        <ul class="task-list">
            {#each $tasks as item}
                <TaskItem task={item} />
            {/each}
        </ul>
    {/if}
{/if}

<style type="scss">
    .task-form {
        margin-bottom: 24px;
        &__box {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        &__input {
            width: 100%;
            max-width: 280px;
            border-radius: 8px;
            border: 1px solid var(--color-grey-2);
            padding: 7px 10px 5px;
            margin-left: 24px;
            outline: none;
            @media (hover: hover) and (pointer: fine) {
                outline: initial;
            }
        }
        &__button {
            width: 24px;
            height: 24px;
        }
        .error {
            text-align: center;
            margin-top: 2px;
        }
    }
    .task-list {
        padding: 0;
    }
</style>
