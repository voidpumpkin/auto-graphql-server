<script>
    export let onSubmit;
    export let name;
    export let Project_tasks_id;
    export let Task_subTasks_id;
    let isParentProject = !Task_subTasks_id;
    $: parentId = isParentProject ? Project_tasks_id : Task_subTasks_id;
    function handleSubmit(e) {
        onSubmit(e, { name, parentId, isParentProject });
    }
</script>

<form class="form-example" on:submit|preventDefault={handleSubmit}>
    <div class="form-example">
        <label for="name">Pavadinimas: </label>
        <input type="text" name="name" id="name" bind:value={name} />
    </div>
    <div class="form-example">
        <label for="isParentProject">Yra po-uždavinys: </label>
        <input
            type="checkbox"
            name="isParentProject"
            id="isParentProject"
            bind:checked={isParentProject}
        />
    </div>
    <div class="form-example">
        {#if isParentProject}
            <label for="parentId">Projekto id: </label>
        {:else}
            <label for="parentId">Tėvinio uždavinio id: </label>
        {/if}
        <input type="number" name="parentId" id="parentId" bind:value={parentId} />
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
