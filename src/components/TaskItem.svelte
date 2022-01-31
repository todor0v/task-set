<script>
    export let task = {};
    import { tasks } from '../store.js';

    const deleteTask = async () => {
        $tasks = $tasks.filter((t) => t.id !== task.id);
        await fetch(`/todos/${task.id}.json`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });
    };

    const taskDone = async () => {
        task.completed = !task.completed;
        await fetch(`/todos/${task.id}.json`, {
            method: 'PATCH',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: task.completed }),
        });
    };
</script>

<li class="task-list__item">
    <label for="task_{task.id}" class="check-radio {task.completed ? 'completed' : ''}">
        <input type="checkbox" class="check-radio__input" id="task_{task.id}" on:change={(e) => taskDone(e)} />
        <span class="check-radio__element">
            <span class="check-radio__element-text">{task.description}</span>
        </span>
    </label>
    <button on:click={deleteTask}>X</button>
</li>

<style type="scss">
    .check-radio {
        display: block;
        position: relative;
        --icon-size: 28px;
        --icon-url: url(./checkbox.svg);

        &__input {
            position: absolute;
            opacity: 0;
        }

        &__element {
            font-size: 12px;
            line-height: 1.33;
            color: var(--color-grey-1);
            padding-left: 36px;
            width: 100%;
            position: relative;
            min-height: 24px;
            display: flex;
            align-items: center;
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

        &__element-text {
            font-size: 16px;
            margin-bottom: -2px;
        }
    }
    .task-list {
        &__item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 280px;
            border: 1px solid var(--color-grey-2);
            padding: 9px;
            border-radius: 14px;
            overflow: hidden;
            list-style: none;
            margin-bottom: 16px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>
