<script>
    import Task from './Task.svelte';
    import CRUDButton from './CRUDButton.svelte';
    import AddTask from './AddTask/AddTask.svelte';
    import queryGraphql from './queryGraphql.js';
    import UpdateTask from './UpdateTask/UpdateTask.svelte';
    import DeleteTask from './DeleteTask/DeleteTask.svelte';
    export let id;
    export let name;
    export let Task_subTasks_id;
    export let Project_tasks_id;
    export let refetch;
    let subTasks;
    $: buttonText = subTasks ? '♻' : '⬅';

    async function fetchSubTasks() {
        if (!id) {
            return;
        }
        const response = await queryGraphql(`query {
    querySubtasks(taskId: "${id}") {
        id
        name
        Task_subTasks_id
        Project_tasks_id
    }
}`);
        subTasks = response?.data?.querySubtasks || [];
    }
</script>

<div class="taskContainer">
    <div class="taskTopRow">
        <p>{name}</p>
        <CRUDButton {buttonText} onCLick={fetchSubTasks} />
        <UpdateTask task={{ id, name, subTasks, Task_subTasks_id, Project_tasks_id }} {refetch} />
        <DeleteTask task={{ id }} {refetch} />
        <AddTask refetch={fetchSubTasks} parentId={id} />
    </div>
    {#if subTasks}
        {#each subTasks as subTask}
            <Task {...subTask} refetch={fetchSubTasks} />
        {/each}
    {/if}
</div>

<style>
    .taskTopRow {
        display: flex;
        background-color: hsl(49, 100%, 90%);
        padding: 1em;
        border-radius: 1em 0em 0em 1em;
        border-left: solid 2px hsl(49, 100%, 85%);
        border-bottom: solid 2px hsl(49, 100%, 85%);
    }
    .taskContainer {
        width: 95%;
        margin-left: auto;
        display: flex;
        flex-direction: column;
    }
    button {
        border-radius: 1em;
        font-size: 1em;
    }
    p {
        font-size: 1em;
        font-weight: 600;
        text-transform: capitalize;
    }
</style>
