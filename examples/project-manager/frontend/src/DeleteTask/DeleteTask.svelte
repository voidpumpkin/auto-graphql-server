<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import DeleteTaskForm from './DeleteTaskForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let task;
    export let refetch;
    export let marginLeft = 'unset';

    async function deleteTask(_e) {
        await queryGraphql(
            `mutation { 
    removeTask(filter: {id: "${task.id}"}) {
        id
    }
}`
        );

        refetch();
    }
</script>

<Modal closeOnOuterClick={false}>
    <CRUDButton
        buttonText="🧨"
        {marginLeft}
        Content={DeleteTaskForm}
        contentProps={{
            onSubmit: deleteTask,
        }}
    />
</Modal>

<style>
</style>
