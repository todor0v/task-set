<script>
    export let task = {};
    let isChecked;

    async function taskDone() {
        const res = await fetch(`/todos/${task.id}.json`, {
            method: 'PATCH',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: isChecked }),
        });

        const newTaskRes = await res.json();
        isChecked = newTaskRes.completed;
    }
    taskDone();
</script>

<main>
    <li class="list-group-item">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" bind:checked={isChecked} on:change={(e) => taskDone(e)} />
        <span class:completed={isChecked}>{task.description}</span>
    </li>
</main>

<style>
    .completed {
        color: red;
        text-decoration: line-through;
    }
</style>