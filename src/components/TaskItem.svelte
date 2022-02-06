<script>
    export let task = {};
    import { fly } from 'svelte/transition';
    import Popup from '../components/Popup.svelte';
    import { clickOutside } from '../helper/clickOutside';
    import { tasks } from '../store.js';
    let timeout = null, preventeDeletionPopup = false, deleteTimeout, showOptions = false, taskCopied = false;

    const deleteData = async () => {
        preventeDeletionPopup = false;
        $tasks = $tasks.filter((t) => t.id !== task.id);
        await fetch(`/todos/${task.id}.json`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });
    };

    const shareTask = async () => {
        try {
            await navigator.share({
                text: task.description
            });
        } catch (error) {
            console.warn(error);
        }
    };

    const closePopup = () => {
        showOptions = false;
    }

    const preventDeletionProcess = () => {
        clearTimeout(deleteTimeout);
        preventeDeletionPopup = false;
    };

    const copyTask = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(task.description);
            taskCopied = true;
            showOptions = false;
            setTimeout(() => {
                taskCopied = false;
            }, 2000);
        }
    }

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
    <button class="task-list__more" on:click={() => {showOptions = !showOptions}}>
        <svg class="icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.381 17.762a2.38 2.38 0 1 0 0-4.762 2.38 2.38 0 0 0 0 4.762zM15 17.762A2.381 2.381 0 1 0 15 13a2.381 2.381 0 0 0 0 4.762zM22.619 17.762a2.381 2.381 0 1 0 0-4.762 2.381 2.381 0 0 0 0 4.762z"></path>
        </svg>
    </button>
    <div class="task-list__options" class:is-active={showOptions} use:clickOutside on:click_outside={closePopup}>
        <div class="task-list__option">
            <button class="task-list__option-btn" on:click={deleteTask}>
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
                <span class="task-list__option-text">Delete Task</span>
            </button>
        </div>
        <div class="task-list__option">
            {#if navigator.share}
                <button class="task-list__option-btn" on:click={shareTask}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                        <title>Link</title>
                        <path d="M208 352h-64a96 96 0 010-192h64M304 160h64a96 96 0 010 192h-64M163.29 256h187.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="36"/>
                    </svg>
                    <span class="task-list__option-text">Share Task</span>
                </button>
                {:else}
                <button class="task-list__option-btn" on:click={copyTask}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                        <title>Link</title>
                        <path d="M208 352h-64a96 96 0 010-192h64M304 160h64a96 96 0 010 192h-64M163.29 256h187.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="36"/>
                    </svg>
                    <span class="task-list__option-text">Copy Task</span>
                </button>
            {/if}
        </div>
    </div>
</li>

{#if taskCopied}
    <Popup text="Task Copied"/>
{:else if  preventeDeletionPopup}
    <Popup info_text="Task Deleted" text="Undo" button={true} buttonAction={preventDeletionProcess}/>
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
                &:hover .task-list__more {
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
        &__more {
            cursor: pointer;
            position: absolute;
            right: -10px;
            transform: translateX(100%);
            opacity: 1;
            visibility: visible;
            transition: opacity var(--transition), visiblity var(--transition);
            .icon {
                width: 18px;
                height: 18px;
                fill: var(--color-grey-1)
            }
            @media (hover: hover) and (pointer: fine) {
                opacity: 0;
                visibility: hidden;
            }
        }
        &__options {
            position: absolute;
            right: -6px;
            top: 50%;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visiblity 0.3s ease;
            background-color: var(--color-grey-3);
            border: 1px solid var(--color-grey-2);
            border-radius: 8px;
            box-shadow: 0px 2px 16px var(--color-grey-2);
            z-index: 10;
            overflow: hidden;
            &.is-active {
                opacity: 1;
                visibility: visible;
            }
        }
        &__option {
            overflow: hidden;
            border-bottom: 1px solid var(--color-grey-2);
            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            &:first-child {
                border-radius: 8px 8px 0 0;
            }
            &:last-child {
                border-radius: 0 0 8px 8px;
            }
        }
        &__option-text {
            font-size: 14px;
            margin-top: 2px;
        }
        &__option-btn {
            display: flex;
            align-items: center;
            gap: 4px 6px;
            padding: 6px 12px;
            cursor: pointer;
            transition: background-color var(--transition);
            width: 100%;
            border-radius: 0;
            .icon {
                width: 18px;
                height: 18px;
            }
            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background-color: hsla(216.7, 47.9%, 57.8%, 0.2);
                }
            }
        }
    }
</style>
