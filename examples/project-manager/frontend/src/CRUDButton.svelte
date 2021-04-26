<script>
    export let buttonText;
    export let Content;
    export let contentProps;
    export let onCLick = () => {};
    export let marginLeft = 'auto';
    export let borderRadius = '1em';
    export let fontSize = '1em';
    import { getContext } from 'svelte';

    let showModal = () => {};

    if (Content) {
        const { open, close } = getContext('simple-modal');

        showModal = () => {
            open(Content, {
                ...contentProps,
                onSubmit: (...args) => {
                    contentProps.onSubmit(...args);
                    close();
                },
            });
        };
    }

    function handleClick() {
        showModal();
        onCLick();
    }
</script>

<button
    on:click={handleClick}
    style="margin-left: {marginLeft}; border-radius: {borderRadius}; font-size: {fontSize};"
    >{buttonText}</button
>
