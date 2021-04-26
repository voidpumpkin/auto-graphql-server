<script>
    import Project from './Project.svelte';
    import AddProject from './AddProject/AddProject.svelte';
    export let refetch;
    export let projects;
</script>

<div class="projectsContainer">
    <div class="projectsTopRow">
        <p>Projektai</p>
        <AddProject {refetch} />
    </div>
    {#if projects}
        {#each projects as project}
            <Project {...project} {refetch} />
        {/each}
    {/if}
</div>

<style>
    .projectsContainer {
        width: clamp(200px, 90%, 600px);
        display: flex;
        flex-direction: column;
    }
    .projectsTopRow {
        display: flex;
        background-color: hsl(15, 100%, 70%);
        padding: 1em;
        border-radius: 1em 1em 0em 1em;
        font-size: 1.5em;
        font-weight: 600;
        border-left: solid 2px hsl(15, 100%, 65%);
        border-bottom: solid 2px hsl(15, 100%, 65%);
    }
</style>
