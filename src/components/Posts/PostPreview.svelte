<script lang="ts">
  import Button from "../Button.svelte";

  export let featuredImg: string;
  export let title = "Post Title";
  export let excerpt =
    "Enter Excerpt text here by passing it into the excerpt prop.";
  export let date = "2024-01-01";
  export let url = "/";
  export let author = "SEIU";
  export let type = "blog";

  const purple_transparent = "/assets/purple_transparent.png";

  // Truncate string to make sure it's not too long
  function truncateString(input_string: string, maxLength: number) {
    if (input_string.length <= maxLength) {
      return input_string;
    }
    let truncated = input_string.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    const print_bool =
      lastSpaceIndex !== -1 && lastSpaceIndex !== truncated.length - 1;
    if (lastSpaceIndex !== -1 && lastSpaceIndex !== truncated.length - 1) {
      truncated = truncated.slice(0, lastSpaceIndex) + "...";
    }

    return truncated;
  }
</script>

<div
  class="relative flex flex-col max-w-[min(420px,_90vw)] bg-white rounded-lg shadow-black shadow-md m-5"
>
  <a
    href={type === "News Article" ? url : "/posts/" + url}
    target={type === "News Article" ? "_blank" : ""}
  >
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
      {truncateString(title, 60)}
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
    <p class="py-1 font-Roboto">{truncateString(excerpt, 240)}</p>
  </div>
  <div class="p-2.5 mt-auto">
    {#if type == "News Article"}
      <Button
        text={"Read More at ".concat(author)}
        href={url}
        target="_blank"
      />
    {:else}
      <Button
        text="Read More"
        href={type === "News Article" ? url : "/posts/" + url}
      />
    {/if}
  </div>
</div>
