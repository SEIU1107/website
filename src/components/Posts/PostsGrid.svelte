<script>
  import PostPreview from "./PostPreview.svelte";

  export let previews = [];
  export let breakpoints;

  export let truncate_title;

  function getBaseProps(post) {
    return {
      featuredImg: post.frontmatter.featuredImg,
      title: post.frontmatter.title,
      excerpt: post.frontmatter.excerpt,
      date: post.frontmatter.date,
      url: post.frontmatter.url,
      type: post.frontmatter.type,
      author: post.frontmatter.author,
    };
  }

  const gridClass = "grid gap-0 justify-center grid-cols-1".concat(
    breakpoints ?? ""
  );
</script>

<div class="flex justify-center content-center m-auto">
  <div class={gridClass}>
    {#each previews as post (post.frontmatter.url)}
      {#if truncate_title !== null}
        <PostPreview {...getBaseProps(post)} {truncate_title} />
      {:else}
        <PostPreview {...getBaseProps(post)} />
      {/if}
    {/each}
  </div>
</div>
