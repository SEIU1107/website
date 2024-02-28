<script>

  import FilterTag from "./FilterTag.svelte";

  let tags = [];
  let selectedTags = [];
  
  // Initialize selectedTags based on the initial state of tags
  $: {
    selectedTags = tags.filter(tag => selectedTags.includes(tag));
  }

  function handleTagSelection(event) {
    const tag = event.target.value;
    if (event.target.checked) {
      selectedTags = [...selectedTags, tag];
    } else {
      selectedTags = selectedTags.filter(t => t !== tag);
    }
  }
</script>

<div class="flex flex-col m-auto p-2.5">
  <h2 class="m-auto font-Trebuchet italic font-bold text-center text-honey-flower-800 py-5 text-4xl lg:text-5xl">
    Filters
  </h2>
  <p class="font-Roboto text-honey-flower-950">
    Tags:
  </p>
  <div class="grid grid-cols-4">
    
    <FilterTag name="Victories" selectedTags={selectedTags} handleTagSelection={handleTagSelection} />
  </div>
 </div>