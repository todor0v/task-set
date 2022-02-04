<script>
    export let task = {};
    import { fly } from 'svelte/transition';
    import { tasks } from '../store.js';
    let timeout = null;
    let preventeDeletionPopup = false;
    let deleteTimeout;

    const deleteData = async () => {
        preventeDeletionPopup = false;
        $tasks = $tasks.filter((t) => t.id !== task.id);
        await fetch(`/todos/${task.id}.json`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });
    };

    const preventDeletionProcess = () => {
        clearTimeout(deleteTimeout);
        preventeDeletionPopup = false;
    };

    const deleteTask = (e) => {
        preventeDeletionPopup = true;
        deleteTimeout = setTimeout(deleteData, 4000);
    };

    const taskDone = async () => {
        task.completed = !task.completed;
        await fetch(`/todos/${task.id}.json`, {
            method: 'PATCH',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: task.completed }),
        });
    };

    const editTask = (e) => {
        clearTimeout(timeout);
        task.description = e.currentTarget.textContent;
        timeout = setTimeout(async () => {
            await fetch(`/todos/${task.id}.json`, {
                method: 'PATCH',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: task.description }),
            });
        }, 1000);
    };
</script>

<li class="task-list__item" class:hidden={preventeDeletionPopup} in:fly={{ x: 200, duration: 400 }}>
    <label for="task_{task.id}" class="check-radio" class:completed={task.completed}>
        <input type="checkbox" class="check-radio__input" tabindex="0" id="task_{task.id}" on:change={(e) => taskDone(e)} />
        <span class="check-radio__element" />
    </label>
    <span class="task-list__item-text" contenteditable="true" on:input={editTask} tabindex="0">{task.description}</span>
    <button class="task-list__item-delete" on:click={deleteTask} aria-label="Delete Task">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
            <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" />
            <path
                d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
            />
        </svg>
    </button>
</li>
{#if preventeDeletionPopup}
    <div class="restore-box" in:fly={{ y: 200, duration: 400 }} out:fly={{ y: 200, duration: 600 }}>
        <span class="restore-box__text">Task Deleted</span>
        <button class="restore-box__button" on:click={preventDeletionProcess} aria-label="Restore Task">Undo</button>
    </div>
{/if}

<style type="scss">
    .check-radio {
        display: block;
        position: relative;
        margin-right: 10px;
        --icon-size: 28px;
        --icon-url: url(./checkbox.svg);

        &__input {
            position: absolute;
            opacity: 0;
            &:focus + .check-radio__element:before {
                box-shadow: 0 0 0 2px var(--color-white);
                filter: drop-shadow(0 1px 3px rgba(131, 131, 131, 0.2));
                background-color: var(--color-white);
                border-color: var(--color-secondary);
            }
        }

        &__element {
            position: relative;
            height: 24px;
            display: flex;
            align-items: center;
            width: 24px;
        }

        &__element:before {
            content: '';
            background-color: var(--color-white);
            position: absolute;
            transition: all var(--transition);
            left: 0;
            width: 24px;
            height: 24px;
            border: 1px solid var(--color-grey-2);
            box-shadow: 0 0 0 2px transparent;
            top: 0;
            border-radius: 4px;
        }

        .completed &__element:before {
            box-shadow: 0 0 0 2px var(--color-white);
            filter: drop-shadow(0 1px 3px rgba(131, 131, 131, 0.2));
            background-color: var(--color-white);
            border-color: var(--color-secondary);
        }

        &__element:after {
            content: '';
            background-image: var(--icon-url);
            width: var(--icon-size);
            height: var(--icon-size);
            background-position: center;
            background-repeat: no-repeat;
            left: -2px;
            top: -2px;
            position: absolute;
            opacity: 0;
            transition: opacity var(--transition);
            visibility: hidden;
        }

        .completed &__element:after {
            opacity: 1;
            visibility: visible;
        }
    }
    .task-list {
        &__item {
            margin: 0 auto;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            max-width: 280px;
            border: 1px solid var(--color-grey-2);
            padding: 9px;
            border-radius: 14px;
            list-style: none;
            margin-bottom: 16px;
            &:last-child {
                margin-bottom: 0;
            }
            @media (hover: hover) and (pointer: fine) {
                &:hover .task-list__item-delete {
                    opacity: 1;
                    visibility: visible;
                }
            }
            &:focus-within {
                outline: 1px solid var(--color-grey-2);
            }
            &:before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 30px;
                transform: translateX(100%);
            }
            &.hidden {
                display: none;
            }
        }
        &__item-text {
            font-size: 16px;
            line-height: 1.33;
            color: var(--color-grey-1);
            margin-top: 1px;
            outline: none;
            width: 100%;
        }
        &__item-delete {
            cursor: pointer;
            will-change: transform;
            width: 18px;
            height: 18px;
            position: absolute;
            right: -5px;
            transform: translateX(100%);
            opacity: 1;
            visibility: visible;
            transition: opacity var(--transition), visiblity var(--transition);
            @media (hover: hover) and (pointer: fine) {
                opacity: 0;
                visibility: hidden;
            }
            &:after {
                content: '';
                position: absolute;
                inset: 50%;
                padding: 20px 15px;
                transform: translate(-50%, -50%);
            }
        }
    }
    .restore-box {
        display: flex;
        align-items: center;
        gap: 10px 14px;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 40px;
        &__button {
            background-color: var(--color-grey-3);
            border: 1px solid var(--color-grey-2);
            padding: 7px 10px 6px;
            border-radius: 6px;
            cursor: pointer;
        }
    }
</style>
