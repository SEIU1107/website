<script>

  import {generalTags} from "./tags";
  import {createEventDispatcher} from 'svelte';

  export let selectedTags = [];

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close', selectedTags);
  }

  function isChecked(tag) {
    return selectedTags.includes(tag);
  }

  function toggleCheckbox(tag) {
    if (isChecked(tag)){
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
  
</script>

<div class="flex flex-col m-auto p-2.5">
  <h2 class="m-auto font-Trebuchet italic font-bold text-center text-honey-flower-800 py-5 text-4xl lg:text-5xl">
    Filters
  </h2>
  <p class="font-Roboto text-honey-flower-950">
    General Tags:
  </p>
  <div class="grid grid-cols-3">
    {#each generalTags as tag}
    <div class="px-2">
      <label for={tag}><input type="checkbox" checked="{isChecked(tag)}" on:change={() => toggleCheckbox(tag)} > {tag}</label>
    </div>
    {/each}
  </div>
  <button on:click={() => closeModal()}>CLOSE</button>
 </div>