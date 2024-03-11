<script>
  export let tag = "tag";
  export let toggleCheckbox;
  export let selectedTags = [];
</script>

<label for={tag} class="hover:cursor-pointer">
  <input
    type="checkbox"
    id={tag}
    checked={selectedTags.includes(tag)}
    on:change={() => toggleCheckbox(tag)}
  />
  {tag}
</label>
