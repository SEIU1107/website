<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import FilterOutlined from "svelte-ant-design-icons/FilterOutlined.svelte";
  import PostPreview from "./PostPreview.svelte";

  // Handles the module that showcases the older posts
  // in a condensed format.

  const dispatch = createEventDispatcher();
  const maxOlderPosts = 10;
  export let toggleShowFilters;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  export let olderPosts = [];

  let selectedPost;
  let currentPage = 1;

  // Calculate the total number of pages
  let totalPages = getTotalPages(olderPosts.length);

  // Calculate the index of the first post to display on the current page
  let startIndex = (currentPage - 1) * maxOlderPosts;

  // Slice the posts array to get the posts for the current page
  let currentPagePosts = olderPosts.slice(
    startIndex,
    startIndex + maxOlderPosts
  );

  function setPage(pageNumber) {
    currentPage = pageNumber;
  }

  function setPreview(post) {
    dispatch("setPost", post);
    selectedPost = post;
  }

  function getTotalPages(length) {
    return Math.ceil(length / maxOlderPosts);
  }

  function updatePagination(length) {
    totalPages = Math.ceil(length / maxOlderPosts);
    currentPage = 1; // Reset currentPage to 1 whenever olderPosts changes
  }

  $: updatePagination(olderPosts.length);

  $: {
    const startIndex = (currentPage - 1) * maxOlderPosts;
    currentPagePosts = olderPosts.slice(startIndex, startIndex + maxOlderPosts);
  }

  // Cleanup
  onDestroy(() => {
    currentPage = 1; // Reset currentPage on component destruction
  });
</script>

<div class="flex flex-row mb-4">
  <div class="flex flex-col">
    <div class="flex flex-row mx-auto pb-4">
      <div
        class="text-4xl text-honey-flower-800 font-Roboto text-center font-bold"
      >
        Older Posts
      </div>
      <button
        class="inline-block rounded-md mx-4 px-2 py-2 text-center uppercase tracking-wide focus:outline-none focus:ring focus:ring-offset-white transition duration-200 text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest"
        on:click={toggleShowFilters}
      >
        <FilterOutlined />
      </button>
    </div>
    <div class="flex flex-col max-w-screen-md">
      {#each currentPagePosts as post, index (post.frontmatter.url)}
        <button
          class={"grid gap-0 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 py-2 my-1 mx-8 md:px-4 rounded-md hover:cursor-pointer transition-all ease-in-out duration-200 ".concat(
            post === selectedPost
              ? "bg-supernova-300 hover:bg-supernova-400 hover:scale-105"
              : "bg-honey-flower-900"
          )}
          on:mouseenter={() => {
            console.log("HEllo!");
            setPreview(post);
          }}
          on:click={() => {
            console.log("Clicked");
            if (post.frontmatter.type === "News Article") {
              window.open(post.frontmatter.url, "_blank");
            } else {
              window.location.href = "/posts/" + post.frontmatter.url;
            }
          }}
        >
          <div
            class="col-span-2 md:col-span-2 lg:col-span-4 px-2 flex flex-nowrap overflow-hidden whitespace-nowrap"
          >
            <div
              class={"truncate ".concat(
                post === selectedPost ? "text-honey-flower-800" : "text-white"
              )}
            >
              {post.frontmatter.title}
            </div>
          </div>
          <div
            class={"text-right px-2 md:text-center ".concat(
              post === selectedPost ? "text-honey-flower-800" : "text-white"
            )}
          >
            {#if post.frontmatter.date}
              {formatDate(post.frontmatter.date)}
            {/if}
          </div>
          <div class="hidden md:block font-bold text-center">
            {#if post.frontmatter.type == "News Article"}
              <p
                class={post === selectedPost
                  ? "text-indigo-800"
                  : "text-indigo-300"}
              >
                News Article
              </p>
            {:else if post.frontmatter.type == "Press Release"}
              <p
                class={post === selectedPost
                  ? "text-supernova-800"
                  : "text-supernova-300"}
              >
                Press Release
              </p>
            {:else}
              <p
                class={post === selectedPost
                  ? "text-honey-flower-800"
                  : "text-honey-flower-300"}
              >
                Blog Post
              </p>
            {/if}
          </div>
        </button>
      {/each}

      <!-- Add placeholder rows if there are fewer than X posts -->
      {#if currentPagePosts.length < maxOlderPosts}
        {#each Array(maxOlderPosts - currentPagePosts.length) as _, index}
          <div
            class="py-2 my-1 mx-8 text-center md:px-4 rounded-md bg-honey-flower-700 opacity-50"
          >
            <div class="text-honey-flower-950">SEIU 1107</div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Pagination section -->
    <div class="flex items-center justify-center mt-4 mb-24">
      {#if totalPages > 0}
        {#each Array(totalPages) as _, index}
          <button
            class={"mx-2 px-4 py-2 rounded-md ".concat(
              currentPage === index + 1
                ? "bg-supernova-300"
                : "bg-honey-flower-900 group hover:bg-honey-flower-950"
            )}
            class:selected={currentPage === index + 1}
            on:click={() => setPage(index + 1)}
          >
            <div
              class={currentPage === index + 1
                ? "text-honey-flower-800"
                : "text-white"}
            >
              {index + 1}
            </div>
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <div class="hidden md:block max-h-min">
    {#if selectedPost}
      <PostPreview
        featuredImg={selectedPost.frontmatter.featuredImg}
        title={selectedPost.frontmatter.title}
        excerpt={selectedPost.frontmatter.excerpt}
        date={selectedPost.frontmatter.date}
        url={selectedPost.frontmatter.url}
        type={selectedPost.frontmatter.type}
        author={selectedPost.frontmatter.author}
        truncate_title={80}
        truncate_excerpt={370}
        show_readmore_button={false}
      />
    {:else}
      <div
        class="hidden md:flex flex-col max-w-[min(420px,_90vw)] p-28 bg-white rounded-lg shadow-black shadow-md m-5"
      >
        <div
          class="text-center font-bold text-3xl italic font-Trebuchet text-gray-400"
        >
          Select a post on the left to continue
        </div>
      </div>
    {/if}
  </div>
</div>
