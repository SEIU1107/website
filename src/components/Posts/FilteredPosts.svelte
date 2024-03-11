<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import FilterInput from "./FilterInput.svelte";

  export let posts;

  let showFilters = false;
  let filteredPosts = posts;

  let selectedTags = []

  const dispatch = createEventDispatcher();
  
  onMount(() => {
    dispatch('toggleFilters', showFilters);
  })

  function toggleShowFilters() {
    showFilters = !showFilters;
    dispatch('toggleFilters', showFilters);
    event.stopPropagation();
  }

  function closeModal(event){
    showFilters = false;
    selectedTags = event.detail
    tags = selectedTags;
  }


  function filterPosts(tags) {
    if (tags.length === 0){
      filteredPosts = posts;
    } else {
      filteredPosts = posts.filter(post => {
        return tags.every(tag => post.frontmatter.tags.includes(tag))
      })
    }
  }

  function clickOutside(element, callbackFunction){
    function onClick(event){
      if (!element.contains(event.target)) {
        callbackFunction();
      }
    }

    document.body.addEventListener('click', onClick);

    return {
      update(newCallbackFunction){
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener('click', onClick)
      }
    }
  }

  
</script>

<button on:click={toggleShowFilters}>
  <div class="inline-block rounded-md px-2 py-2 text-center uppercase tracking-wide focus:outline-none focus:ring focus:ring-offset-white transition duration-200 text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest">
    Filters
  </div>
  <div>
    Chosen tags: {selectedTags}
   </div>
</button>

{#if showFilters}

<div transition:fade={{duration: 200}} class="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 z-50 justify-center align-middle">
  <div class="fixed top-1/4 right-1/2 shadow-lg max-w-screen-lg h-[50vh] rounded-md m-auto bg-gradient-to-br from-supernova-50 to-supernova-100" use:clickOutside={() => {
    closeModal()
   }} >
     <FilterInput on:close={closeModal} bind:selectedTags={selectedTags} />
   </div>  
   
</div>

{/if}
