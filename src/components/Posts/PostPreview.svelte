<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../Button.svelte";

  export let featuredImg: string;
  export let title = "Post Title";
  export let excerpt =
    "Enter Excerpt text here by passing it into the excerpt prop.";
  export let date = "2024-01-01";
  export let url = "/";
  export let author = "SEIU";
  export let type = "blog";

  // Optional parameters
  // Show the "Read More" Button
  export let show_readmore_button = true;

  // Truncate title this many characters (No truncation if 0)
  export let truncate_title = 0;

  // Truncate excerpt this many characters (No truncation if 0)
  export let truncate_excerpt = 0;

  const purple_transparent = "/assets/purple_transparent.png";

  // Truncate string to make sure it's not too long
  function truncateString(input_string: string, maxLength: number) {
    if (input_string.length <= maxLength) {
      return input_string;
    }
    let truncated = input_string.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex !== -1 && lastSpaceIndex !== truncated.length - 1) {
      truncated = truncated.slice(0, lastSpaceIndex) + "...";
    }

    return truncated;
  }

  // Post URL if news article
  // Otherwise, use the title
  let urlToUse: string;

  function updateUrlToUse(url: string) {
    urlToUse =
      type === "News Article" && url
        ? url
        : "/posts/" + url.replaceAll(" ", "-");
  }

  onMount(() => {
    updateUrlToUse(url);
  });

  $: updateUrlToUse(url);
</script>

<div
  class="relative flex flex-col max-w-[min(420px,_90vw)] bg-white rounded-lg shadow-black shadow-md m-5"
>
  <a href={urlToUse} target={type === "News Article" ? "_blank" : ""}>
    <div class="relative group rounded-lg z-6">
      <img
        src={featuredImg}
        alt="Featured Img"
        class="rounded-t-lg aspect-[3/2] object-cover transition grayscale-0 group-hover:grayscale duration-300"
      />

      <div
        class="transition-opacity opacity-0 group-hover:opacity-100 duration-300"
      >
        <img
          class="absolute top-0 left-0 rounded-t-lg"
          src={purple_transparent}
          alt=""
        />
      </div>

      <div
        class="transition-opacity opacity-0 group-hover:opacity-100 duration-300"
      >
        <h1
          class="text-white text-center font-Trebuchet text-4xl absolute top-1/3 left-1/2 -translate-x-1/2"
        >
          <b>Read More</b>
        </h1>
      </div>
    </div>
  </a>

  <div class="flex flex-col px-2.5 pb-2.5">
    <h2
      class="font-Trebuchet text-honey-flower-800 font-bold text-lg lg:text-xl py-2 overflow-hidden"
    >
      {#if truncate_title}
        {truncateString(title, truncate_title)}
      {:else}
        {title}
      {/if}
    </h2>
    <div class="flex flex-row font-bold py-1 text-lg">
      <p>
        {new Date(date).toLocaleDateString("en-US", {
          timeZone: "UTC",
        })}
      </p>
      <div class="px-2 text-center">
        {#if type == "News Article"}
          <p class="text-indigo-600">News Article</p>
        {:else if type == "Press Release"}
          <p class="text-supernova-600">Press Release</p>
        {:else}
          <p class="text-honey-flower-600">Blog Post</p>
        {/if}
      </div>
    </div>
    <p class="py-1 font-Roboto">
      {#if truncate_excerpt}
        {truncateString(excerpt, truncate_excerpt)}
      {:else}
        {excerpt}
      {/if}
    </p>
  </div>
  {#if show_readmore_button}
    <div class="p-2.5 mt-auto">
      {#if type == "News Article"}
        <Button
          text={"Read More at ".concat(author)}
          href={urlToUse}
          target="_blank"
        />
      {:else}
        <Button text="Read More" href={urlToUse} />
      {/if}
    </div>
  {/if}
</div>
