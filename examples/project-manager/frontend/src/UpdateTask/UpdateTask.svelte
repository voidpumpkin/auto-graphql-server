<script>
    import Modal from 'svelte-simple-modal';
    import CRUDButton from '../CRUDButton.svelte';
    import UpdateTaskForm from './UpdateTaskForm.svelte';
    import queryGraphql from '../queryGraphql.js';
    import diffrence from 'lodash.difference';
    export let task;
    export let refetch;
    export let marginLeft = 'unset';

    async function updateTask(_e, { isSubtask, parentIds, name }) {
        let input = '';
        if (task.isParentProject === isSubtask) {
            if (task.isParentProject) {
                input += `Task_subTasks_Task_list: ["${parentIds.join('","')}"] `;
                input += `Project_tasks_Project_list: null} `;
            } else {
                input += `Project_tasks_Project_list: ["${parentIds.join('","')}"] `;
                input += `Task_subTasks_Task_list: null `;
            }
        } else {
            const parentField = isSubtask ? 'Task_subTasks_Task_list' : 'Project_tasks_Task_list';
            if (diffrence(task[parentField], parentIds).length) {
                const inputField = isSubtask
                    ? 'Task_subTasks_Task_list'
                    : 'Project_tasks_Project_list';
                input += `${inputField}: ["${parentIds.join('","')}"] `;
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
