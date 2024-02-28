<script>
  export let name = "tag";
  export let handleTagSelection;
  export let selectedTags;
</script>

<label for={name}><input type="checkbox" id={name} value={name} on:change={handleTagSelection} checked={selectedTags.includes(name)}> {name}</label>
 