<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import AddTaskForm from './AddTaskForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let parentId;
    export let isParentProject = false;
    export let refetch;
    export let marginLeft = 'unset';

    async function addTask(_e, { name }) {
        const parentField = isParentProject ? 'Project_tasks_id' : 'Task_subTasks_id';
        await queryGraphql(
            `mutation { 
    addTask(input: {name: "${name}" ${parentField}: "${parentId}" } ) {
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
        Content={AddTaskForm}
        contentProps={{
            onSubmit: addTask,
        }}
    />
</Modal>

<style>
</style>
