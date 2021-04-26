<script>
    export let onSubmit;
    function handleSubmit(e) {
        onSubmit(e);
    }
</script>

<form class="form-example" on:submit|preventDefault={handleSubmit}>
    <p>Ar tikrai norite trinti?</p>
    <div class="form-example">
        <input type="submit" value="Taip" />
    </div>
</form>

<style>
    .form-example {
        display: flex;
        flex-direction: column;
        padding-left: 1em;
        padding-right: 1em;
        align-items: center;
    }
</style>
