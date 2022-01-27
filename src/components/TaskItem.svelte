<script>
    import { tasks } from '../store.js';
    export let task = {};
    let theTask;
    let isChecked;

    async function taskDone() {
        let updatedTasks = $tasks.map((currentTask) => {
            if (currentTask.id === task.id) {
                currentTask.completed = isChecked;
                theTask = currentTask;
                return currentTask;
            }
            return currentTask;
        });
        console.log(theTask.id);
        const res = await fetch(`/todos/${theTask.id}.json`, {
            method: 'PATCH',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: theTask.completed }),
        });
        const newTaskRes = await res.json();
        tasks.set(updatedTasks);
    }
</script>

<main>
    <li class="list-group-item">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" bind:checked={isChecked} on:change={(e) => taskDone(e)} />
        <span class:completed={task.completed}>{task.description}</span>
    </li>
</main>

<style>
    .completed {
        color: red;
        text-decoration: line-through;
    }
</style>
