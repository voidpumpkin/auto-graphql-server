<script>
    import AddTask from './AddTask/AddTask.svelte';
    import queryGraphql from './queryGraphql.js';
    import UpdateTask from './UpdateTask/UpdateTask.svelte';
    import DeleteTask from './DeleteTask/DeleteTask.svelte';
    export let id;
    export let name;
    export let Project_tasks_Project_list;
    export let Task_subTasks_Task_list;
    export let refetch;
    export let isParentProject = false;
    let subTasks;
    $: Project_tasks_Project_list && fetchSubTasks();
    $: Task_subTasks_Task_list && fetchSubTasks();

    async function fetchSubTasks() {
        if (!id) {
            return;
        }
        const response = await queryGraphql(
            `query {
    querySubtasks(filter: {id: "${id}"}) {
        id
        name
        Task_subTasks_Task_list {
            id
        }
    }
}`
        );
        subTasks = response?.data?.querySubtasks || [];
    }
</script>

<div class="taskContainer">
    <div class="taskTopRow">
        <p>{name}</p>
        <UpdateTask
            task={{
                id,
                name,
                subTasks,
                Project_tasks_Project_list,
                Task_subTasks_Task_list,
                isParentProject,
            }}
            {refetch}
        />
        <DeleteTask task={{ id }} {refetch} />
        <AddTask refetch={fetchSubTasks} parentId={id} />
    </div>
    {#if subTasks}
        {#each subTasks as subTask}
            <svelte:self {...subTask} {refetch} />
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
    p {
        font-size: 1em;
        font-weight: 600;
        text-transform: capitalize;
    }
</style>
