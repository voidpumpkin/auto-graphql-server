<script>
    import { onMount } from 'svelte';
    import queryGraphql from './queryGraphql.js';
    import ProjectsContainer from './ProjectsContainer.svelte';
    let projects = [];
    async function refetch() {
        const response = await queryGraphql(`query {
    projects {
        id
        name
        tasks {
            id
            name
            Task_subTasks_id
            Project_tasks_id
        }
    }
}`);
        projects = response?.data?.projects || [];
    }
    onMount(refetch);
</script>

<main>
    <h1>Projektų valdytojas</h1>
    <ProjectsContainer {projects} {refetch} />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>
