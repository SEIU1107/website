<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";

  import FilterInput from "./FilterInput.svelte";
  import Button from "../Button.svelte";
  import PostsGrid from "./PostsGrid.svelte";
  import HeadingTitle from "../HeadingTitle.svelte";
  import OtherPosts from "./OtherPosts.svelte";

  export let posts;

  let showFilters = false;
  let filteredPosts = posts;

  let selectedTags = [];
  let selectedPostTypes = [];
  let latestFourPosts = getLatestFour(posts); // Latest four previews
  let olderPosts = getFifthOnwards(posts); // Fifth and onwards, if any

  const dispatch = createEventDispatcher();

  onMount(() => {
    dispatch("toggleFilters", showFilters);
  });

  function toggleShowFilters() {
    showFilters = !showFilters;
    dispatch("toggleFilters", showFilters);
    event.stopPropagation();
  }

  function getLatestFour(arr) {
    arr.sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );
    return arr.slice(0, 4);
  }

  function getFifthOnwards(arr) {
    arr.sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );
    return arr.slice(4);
  }

  function closeModal(event) {
    showFilters = false;
    selectedTags = event?.detail || selectedTags;
  }

  function filterPosts(tags, postTypes) {
    if (tags.length === 0 && !postTypes.length) {
      filteredPosts = posts;
    } else {
      filteredPosts = posts.filter((post) => {
        // Check if the post has the specified type or is a "Blog Post" by default
        const hasType = postTypes.length
          ? post.frontmatter.type
            ? postTypes.includes(post.frontmatter.type)
            : postTypes.includes("Blog Post")
          : true;

        // If the post matches the type, apply the tag filter
        if (hasType) {
          // If no tags are selected, include all posts of the specified type
          if (tags.length === 0) {
            return true;
          } else {
            // Filter posts by tags
            return post.frontmatter.tags?.some((tag) => tags.includes(tag));
          }
        }

        return false; // Exclude posts that don't match the specified type or "Blog Post"
      });
    }

    latestFourPosts = getLatestFour(filteredPosts);
    olderPosts = getFifthOnwards(filteredPosts);
  }

  function clearFilters() {
    selectedTags = [];
    selectedPostTypes = [];
  }

  function clickOutside(element, callbackFunction) {
    function onClick(event) {
      if (!element.contains(event.target)) {
        callbackFunction();
      }
    }

    document.body.addEventListener("click", onClick);

    return {
      update(newCallbackFunction) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener("click", onClick);
      },
    };
  }

  $: filterPosts(selectedTags, selectedPostTypes);
</script>

{#if showFilters}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 z-50 justify-center align-middle"
  >
    <div
      class="fixed top-0 left-0 shadow-lg max-w-screen-lg min-h-max px-5 py-2 rounded-md mx-4 mt-5 lg:mx-10 bg-gradient-to-br from-supernova-50 to-supernova-100"
      use:clickOutside={() => {
        closeModal();
      }}
    >
      <FilterInput
        on:close={closeModal}
        bind:selectedTags
        bind:selectedPostTypes
      />
    </div>
  </div>
{/if}

<div class="flex flex-col">
  <HeadingTitle text="SEIU 1107 Updates" />
  <div class="py-0.5 flex flex-wrap mx-auto justify-center max-w-screen-sm">
    <div class="font-bold text text-lg text-gray-700 font-Roboto">Show:</div>
    {#if selectedPostTypes.length === 0 || selectedPostTypes.length === 3}
      <div class="text-gray-500 text-lg px-2 font-bold">All Posts</div>
    {:else}
      {#each selectedPostTypes as postType}
        <div class="text-gray-500 text-lg px-2">
          {postType.concat("s")}
        </div>
      {/each}
    {/if}
  </div>
  <div class="py-2 flex flex-wrap mx-auto justify-center max-w-screen-sm">
    {#if selectedTags.length > 0}
      <div class="font-bold text text-lg text-gray-700 font-Roboto">
        Filtered By:
      </div>
      {#each selectedTags as tag}
        <div class="text-gray-500 italic text-lg px-2">
          {tag}
        </div>
      {/each}
    {:else}
      <div class="italic text text-lg text-gray-700 font-Roboto">
        No Filters Selected
      </div>{/if}
  </div>
  <div class="flex flex-row m-auto">
    <div class="px-2">
      <Button text="Set Filters" onClick={toggleShowFilters} />
    </div>
    <div class="px-2">
      {#if selectedTags.length > 0 || (selectedPostTypes.length > 0 && selectedPostTypes.length !== 3)}
        <Button text="Clear Filters" onClick={clearFilters} />
      {/if}
    </div>
  </div>

  <HeadingTitle
    text={"Latest from SEIU".concat(
      selectedTags.length > 0 ||
        (selectedPostTypes.length > 0 && selectedPostTypes.length !== 3)
        ? " (Filtered)"
        : ""
    )}
  />

  <div class="max-w-screen-2xl m-auto">
    <PostsGrid
      bind:previews={latestFourPosts}
      breakpoints="sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    />
  </div>

  {#if olderPosts.length > 0}
    <HeadingTitle
      text={"Older Posts".concat(
        selectedTags.length > 0 ||
          (selectedPostTypes.length > 0 && selectedPostTypes.length !== 3)
          ? " (Filtered)"
          : ""
      )}
    />

    <div class="flex m-auto">
      <OtherPosts bind:olderPosts />
    </div>
  {/if}
</div>
