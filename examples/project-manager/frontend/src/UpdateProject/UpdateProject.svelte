<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import UpdateProjectForm from './UpdateProjectForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let project;
    export let refetch;
    export let marginLeft = 'auto';

    async function updateProject(_e, { name }) {
        if (name === project.name) {
            return;
        }
        await queryGraphql(
            `mutation { 
    updateProject(
        filter: {id: "${project.id}"}
        input: {name: "${name}"}) {
        id
    }
}`
        );

        refetch();
    }
</script>

<Modal closeOnOuterClick={false}>
    <CRUDButton
        buttonText="📝"
        {marginLeft}
        Content={UpdateProjectForm}
        contentProps={{
            onSubmit: updateProject,
        }}
    />
</Modal>

<style>
</style>
