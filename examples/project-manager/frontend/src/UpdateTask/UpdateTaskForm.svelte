<script>
    export let onSubmit;
    export let name;
    export let Project_tasks_Project_list;
    export let Task_subTasks_Task_list;
    export let isParentProject;
    let isSubtask = !isParentProject;
    let parentIds = Project_tasks_Project_list?.length
        ? Project_tasks_Project_list.map((e) => e.id).join()
        : Task_subTasks_Task_list.map((e) => e.id).join();
    function handleSubmit(e) {
        onSubmit(e, { name, parentIds: parentIds.split(','), isParentProject, isSubtask });
    }
</script>

<form class="form-example" on:submit|preventDefault={handleSubmit}>
    <div class="form-example">
        <label for="name">Pavadinimas: </label>
        <input type="text" name="name" id="name" bind:value={name} />
    </div>
    <div class="form-example">
        <label for="isSubtask">Yra po-uždavinys: </label>
        <input type="checkbox" name="isSubtask" id="isSubtask" bind:checked={isSubtask} />
    </div>
    <div class="form-example">
        {#if isSubtask}
            <label for="parentId">Tėvinių uždavinių id: </label>
        {:else}
            <label for="parentId">Projekto id: </label>
        {/if}
        <input type="text" name="parentId" id="parentId" bind:value={parentIds} />
    </div>
    <div class="form-example">
        <input type="submit" value="Saugoti" />
    </div>
</form>

<style>
    .form-example {
        display: flex;
        flex-direction: column;
        padding-left: 1em;
        padding-right: 1em;
    }
</style>
