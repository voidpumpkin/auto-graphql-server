<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import UpdateTaskForm from './UpdateTaskForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    export let task;
    export let refetch;
    export let marginLeft = 'unset';

    async function updateTask(_e, { isParentProject, parentId, name }) {
        const wasParentProject = !!task.Project_tasks_id || false;
        let input = '';
        if (wasParentProject !== isParentProject) {
            if (wasParentProject) {
                input += `Task_subTasks_id: ${parentId} `;
                input += `Project_tasks_id: null} `;
            } else {
                input += `Project_tasks_id: ${parentId} `;
                input += `Task_subTasks_id: null `;
            }
        } else {
            const parentField = isParentProject ? 'Project_tasks_id' : 'Task_subTasks_id';
            if (task[parentField] != parentId) {
                input += `${parentField}: ${parentId} `;
            }
        }
        if (name !== task.name) {
            input += `name: "${name}" `;
        }
        if (!input) {
            return;
        }
        await queryGraphql(
            `mutation { 
    updateTask(
        filter: {id: "${task.id}"}
        input: {${input}}) {
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
        Content={UpdateTaskForm}
        contentProps={{
            onSubmit: updateTask,
            ...task,
        }}
    />
</Modal>

<style>
</style>
