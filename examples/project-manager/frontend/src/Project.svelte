<script>
    import AddTask from './AddTask/AddTask.svelte';
    import DeleteProject from './DeleteProject/DeleteProject.svelte';
    import Task from './Task.svelte';
    import UpdateProject from './UpdateProject/UpdateProject.svelte';
    export let id;
    export let name;
    export let tasks;
    export let refetch;
</script>

<div class="projectContainer">
    <div class="projectTopRow">
        <p>{name}</p>
        <UpdateProject project={{ id, name }} {refetch} />
        <DeleteProject project={{ id }} {refetch} />
        <AddTask {refetch} parentId={id} isParentProject={true} />
    </div>
    {#if tasks}
        {#each tasks as task}
            <Task {...task} {refetch} isParentProject={true} />
        {/each}
    {/if}
</div>

<style>
    .projectTopRow {
        display: flex;
        background-color: hsl(15, 100%, 90%);
        padding: 1em;
        border-radius: 1em 0em 0em 1em;
        border-left: solid 2px hsl(15, 100%, 85%);
        border-bottom: solid 2px hsl(15, 100%, 85%);
    }
    .projectContainer {
        width: 95%;
        margin-left: auto;
        display: flex;
        flex-direction: column;
    }
    p {
        font-size: 1.5em;
        font-weight: 500;
        text-transform: capitalize;
    }
</style>
