<script>
    export let onSubmit;
    export let name;
    function handleSubmit(e) {
        onSubmit(e, { name });
    }
</script>

<form class="form-example" on:submit|preventDefault={handleSubmit}>
    <div class="form-example">
        <label for="name">Pavadinimas: </label>
        <input type="text" name="name" id="name" bind:value={name} />
    </div>
    <div class="form-example">
        <input type="submit" value="Saugoti" />
    </div>
</form>

<style>
    .form-example {
        display: flex;
        flex-direction: column;
        padding-left: 1em;
        padding-right: 1em;
    }
</style>
