<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import DeleteProjectForm from './DeleteProjectForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let project;
    export let refetch;
    export let marginLeft = 'unset';

    async function deleteProject(_e) {
        await queryGraphql(
            `mutation { 
    removeProject(filter: {id: "${project.id}"})
}`
        );

        refetch();
    }
</script>

<Modal closeOnOuterClick={false}>
    <CRUDButton
        buttonText="🧨"
        {marginLeft}
        Content={DeleteProjectForm}
        contentProps={{
            onSubmit: deleteProject,
        }}
    />
</Modal>

<style>
</style>
