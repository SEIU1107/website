<script>
  import { generalTags, shopTags, postTypes } from "./tags";
  import { createEventDispatcher } from "svelte";
  import FilterTag from "./FilterTag.svelte";
  import Button from "../Button.svelte";

  export let selectedTags = [];
  export let selectedPostTypes = [];

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("close", selectedTags);
  }

  function isChecked(tag) {
    return selectedTags.includes(tag);
  }

  function toggleCheckbox(tag) {
    if (isChecked(tag)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  function toggleTypeCheckbox(postType) {
    if (selectedPostTypes.includes(postType)) {
      selectedPostTypes = selectedPostTypes.filter((t) => t !== postType);
    } else {
      selectedPostTypes = [...selectedPostTypes, postType];
    }
  }

  function selectAllTags(tags) {
    tags.forEach((tag) => {
      if (!isChecked(tag)) {
        selectedTags = [...selectedTags, tag];
      }
    });
  }

  function deselectAllTags(tags) {
    tags.forEach((tag) => {
      selectedTags = selectedTags.filter((t) => t !== tag);
    });
  }
</script>

<div class="flex flex-col m-auto p-1.5">
  <h2
    class="m-auto font-Trebuchet italic font-bold text-center text-honey-flower-800 py-5 text-3xl md:text-4xl lg:text-5xl"
  >
    Filters
  </h2>
  <div class="grid grid-cols-3">
    {#each postTypes as tag}
      <div class="px-2 font-bold">
        <FilterTag
          {tag}
          toggleCheckbox={toggleTypeCheckbox}
          bind:selectedTags={selectedPostTypes}
        />
      </div>
    {/each}
  </div>
  <div class="flex flex-col md:py-0.5">
    <p
      class="md:pb-2 text-center font-Roboto font-bold text-2xl text-honey-flower-950"
    >
      General
    </p>
    <div class="grid grid-cols-2 lg:grid-cols-3">
      {#each generalTags as tag}
        <div class="px-2">
          <FilterTag {tag} {toggleCheckbox} bind:selectedTags />
        </div>
      {/each}
    </div>
    <div class="py-1.5 flex flex-row m-auto">
      <Button
        onClick={() => {
          selectAllTags(generalTags);
        }}
        styling="text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest scale-75"
        text="Select All"
      />
      <Button
        onClick={() => {
          deselectAllTags(generalTags);
        }}
        styling="text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest scale-75"
        text="Remove All"
      />
    </div>
  </div>

  <div class="flex flex-col md:py-2">
    <p
      class="md:py-2 text-center font-Roboto font-bold text-2xl text-honey-flower-950"
    >
      Employer
    </p>
    <div class="grid grid-cols-2 lg:grid-cols-3">
      {#each shopTags as tag}
        <div class="px-2">
          <FilterTag {tag} {toggleCheckbox} bind:selectedTags />
        </div>
      {/each}
    </div>
    <div class="py-1.5 flex flex-row m-auto">
      <Button
        onClick={() => {
          selectAllTags(shopTags);
        }}
        styling="text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest scale-75"
        text="Select All"
      />
      <Button
        onClick={() => {
          deselectAllTags(shopTags);
        }}
        styling="text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest scale-75"
        text="Remove All"
      />
    </div>
  </div>

  <Button
    onClick={() => {
      closeModal();
    }}
    text="Close"
  />
</div>
