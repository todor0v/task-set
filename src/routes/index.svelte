<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import auth from '../authService.js';
    import ImageLoader from '../components/Image/ImageLoader.svelte';
    import TaskItem from '../components/TaskItem.svelte';
    import { error,isAuthenticated,tasks,user } from '../store.js';
    let auth0Client, value, taskInput;
    let image = {
        src: 'https://res.cloudinary.com/dunzfvymb/image/upload/v1644749994/task-girl_l5ew26.svg',
        alt: 'Drawing of all Lord of the Rings characters',
        aspect_ratio: '877/600',
        width: '590px',
        custom_class: '',
    };

    let image2 = {
        src: 'https://res.cloudinary.com/dunzfvymb/image/upload/v1644749994/girl-stairs_voxice.svg',
        alt: 'Drawing of all Lord of the Rings characters',
        aspect_ratio: '765/832',
        width: '430px',
        custom_class: '',
    };

    $: if ($user && $user.name) {
        getTasks($user);
    };

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
    {:else}
    <div in:fly={{ y: -50, duration: 250, delay: 300 }} class="home-layout">
        <div class="home-layout__top">
            <h1 class="main-title">An easy to use, intuitive task management app</h1>
            <ImageLoader picture={image} />
        </div>
        <div class="home-layout__bottom">
            <ImageLoader picture={image2} />
        </div>
    </div>
{/if}

<style type="scss">
    .task-form {
        margin-bottom: 24px;
        &__box {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 0 2px;
        }
        &__input {
            width: 100%;
            max-width: 330px;
            border-radius: 8px;
            border: 1px solid var(--color-grey-2);
            padding: 10px 11px 8px;
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
    .main-title {
        font-size: 60px;
        max-width: 671px;
        margin: 0 auto;
        text-align: center;
        @media screen and (max-width: 1440px) {
            font-size: 42px;
            max-width: 340px;
        }
        @media screen and (max-width: 480px) {
            font-size: 40px;
        }
        @media screen and (max-width: 375px) {
            font-size: 35px;
        }
    }
    .home-layout {
        margin-top: 80px;
        @media screen and (max-width: 880px) {
            margin-top: 220px;
        }
        @media screen and (max-width: 480px) {
            margin-top: 170px;
        }
    }
    .home-layout__top {
        position: relative;
        display: flex;
        align-items: center;
        @media screen and (max-width: 480px) {
            margin-bottom: 40px;
        }
    }
    :global(.home-layout__top .aspect-ratio) {
        position: absolute;
        right: -125px;
        top: -125px;
        @media screen and (max-width: 1440px) {
            --width: 460px !important;
        }
        @media screen and (max-width: 880px) {
            top: -260px;
            --width: 410px !important;
        }
        @media screen and (max-width: 480px) {
            margin-bottom: 40px;
            top: -200px;
            right: -70px;
            --width: 290px !important;
        }
    }
    :global(.home-layout__bottom .aspect-ratio) {
        @media screen and (max-width: 1440px) {
            --width: 350px !important;
        }
        @media screen and (max-width: 880px) {
            --width: 305px !important;
        }
        @media screen and (max-width: 480px) {
            --width: 225px !important;
        }
    }
    :global(.home-layout .aspect-ratio) {
        margin-right: auto;
        width: 100%;
    }
    :global(.main-content) {
        overflow: hidden;
    }
</style>
