<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import AddProjectForm from './AddProjectForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let refetch;
    export let marginLeft = 'auto';

    async function addProject(_e, { name }) {
        await queryGraphql(
            `mutation { 
    addProject(input: {name: "${name}" Query_projects_id: "1" } ) {
        id
    }
}`
        );
        refetch();
    }
</script>

<Modal closeOnOuterClick={false}>
    <CRUDButton
        buttonText="➕"
        {marginLeft}
        Content={AddProjectForm}
        contentProps={{
            onSubmit: addProject,
        }}
    />
</Modal>

<style>
</style>
