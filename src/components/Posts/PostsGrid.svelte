<script>
  import PostPreview from "./PostPreview.svelte";

  export let previews = [];
  export let breakpoints;

  // Optional props that should also be passed in if present
  export let truncate_title;
  export let truncate_excerpt;

  export function getProps(post) {
    let ret_obj = {
      featuredImg: post.frontmatter.featuredImg,
      title: post.frontmatter.title,
      excerpt: post.frontmatter.excerpt,
      date: post.frontmatter.date,
      url: post.frontmatter.url,
      type: post.frontmatter.type,
      author: post.frontmatter.author,
    };
    if (truncate_title) {
      ret_obj.truncate_title = truncate_title;
    }
    if (truncate_excerpt) {
      ret_obj.truncate_excerpt = truncate_excerpt;
    }
    return ret_obj;
  }

  const gridClass = "grid gap-0 justify-center grid-cols-1".concat(
    breakpoints ?? ""
  );
</script>

<div class="flex justify-center content-center m-auto">
  <div class={gridClass}>
    {#each previews as post (post.frontmatter.url)}
      <PostPreview {...getProps(post)} />
    {/each}
  </div>
</div>
