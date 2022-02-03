<script>
    import { onMount } from 'svelte';
    import auth from '../authService.js';
    import TaskItem from '../components/TaskItem.svelte';
    import { error, isAuthenticated, tasks, user } from '../store.js';
    let auth0Client;
    let value;
    let taskInput;

    $: if ($user && $user.name) {
        getTasks($user);
    }

    onMount(async () => {
        auth0Client = await auth.createClient();
        isAuthenticated.set(await auth0Client.isAuthenticated());
        user.set(await auth0Client.getUser());
    });

    const handleKeypress = (e) => {
        if (e.key === 'Enter') {
            addItem(e.target.value);
            e.target.value = '';
        }
    };

    const getTasks = async (user) => {
        try {
            const res = await fetch(`/todos/${user?.name}.json`);
            $tasks = await res.json();
        } catch (_error) {
            console.error(_error);
        }
    };

    const addItem = async (param) => {
        if (param?.currentTarget?.tagName.toLowerCase() === 'button') {
            value = taskInput.value;
            taskInput.value = '';
        } else {
            value = param;
        }

        if (!value) {
            $error.text = 'You cannot create an empty task';
        } else {
            $error.text = '';
            const newTaskItam = await fetch('/todos.json', {
                method: 'POST',
                headers: { accept: 'text/plain' },
                body: JSON.stringify({ description: value, completed: false, user: $user.email }),
            });
            const newTaskItamData = await newTaskItam.json();
            $tasks = [...$tasks, newTaskItamData];
        }
    };
</script>

<svelte:head>
    <title>TaskSet: Todo list app</title>
</svelte:head>

{#if $isAuthenticated}
    <div class="task-form">
        <div class="task-form__box">
            <input type="text" class="task-form__input" bind:this={taskInput} on:keypress={handleKeypress} placeholder="What do you want to do?" />
            <button type="button" class="task-form__button" on:click={addItem} aria-label="Add Task">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
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
                &:focus {
                    outline: 1px solid var(--color-grey-2);
                }
            }
        }
        &__button {
            cursor: pointer;
            width: 24px;
            height: 24px;
            .icon {
                will-change: transform;
                transition: transform var(--transition);
            }
            @media (hover: hover) and (pointer: fine) {
                &:hover .icon {
                    transform: scale(1.2);
                }
            }
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
