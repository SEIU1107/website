<script>
  import { createEventDispatcher } from "svelte";
  import PostPreview from "./PostPreview.svelte";

  // Handles the module that showcases the older posts
  // in a condensed format.

  const dispatch = createEventDispatcher();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  export let olderPosts = [];

  let selectedPost;

  function setPreview(post) {
    dispatch("setPost", post);
    selectedPost = post;
  }
</script>

<div class="flex flex-row">
  <div class="flex flex-col max-w-screen-md">
    {#each olderPosts as post}
      <button
        class={"grid gap-0 grid-cols-3 md:grid-cols-6 py-2 my-2 mx-8 md:px-4 rounded-md hover:cursor-pointer ".concat(
          post === selectedPost
            ? "bg-supernova-300 hover:bg-supernova-400"
            : "bg-honey-flower-900 group hover:bg-honey-flower-950"
        )}
        on:click={() => setPreview(post)}
      >
        <div
          class="col-span-2 md:col-span-4 px-2 flex flex-nowrap overflow-hidden whitespace-nowrap"
        >
          <div
            class={"truncate ".concat(
              post === selectedPost ? "text-black" : "text-white"
            )}
          >
            {post.frontmatter.title}
          </div>
        </div>
        <div
          class={"text-right px-2 md:text-center ".concat(
            post === selectedPost ? "text-black" : "text-white"
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
  </div>

  <div class="max-h-min">
    {#if selectedPost}
      <PostPreview
        featuredImg={selectedPost.frontmatter.featuredImg}
        title={selectedPost.frontmatter.title}
        excerpt={selectedPost.frontmatter.excerpt}
        date={selectedPost.frontmatter.date}
        url={selectedPost.frontmatter.url}
        type={selectedPost.frontmatter.type}
        author={selectedPost.frontmatter.author}
      />
      {selectedPost?.frontmatter.url}
    {:else}
      <div class="hidden md:block">PREVIEW</div>
    {/if}
  </div>
</div>
