<script lang="ts">
  /* Cycles through a bunch of images given a duration and stying */
  /* Be sure to import the images beforehand! */

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import type { ImageMetadata } from "astro";
  import { preloadImages, measureImageHeights } from "../components/util";

  export let images: ImageMetadata[] = []; // List of strings to display
  export let duration = 2000; // Time each string is displayed (in milliseconds)
  export let imageStyle: string = "";
  export let alt: string = "";

  export let fadeDuration = 750; // How long (in ms) the fade should be

  let current = 0;
  let visible = true;
  let maxHeight = 500;
  let preloadedImages: HTMLImageElement[] = [];

  function next() {
    visible = false;
    setTimeout(() => {
      current = (current + 1) % images.length;
      visible = true;
    }, fadeDuration); // This delay should match the fade duration
  }

  let interval: ReturnType<typeof setInterval>;
  let resizeHandler: () => void;

  onMount(() => {
    async function setup() {
      // Preload images
      preloadedImages = preloadImages(images, imageStyle);

      // Measure and set max height after images load
      const imageSize = await measureImageHeights(preloadedImages, imageStyle);
      maxHeight = imageSize.height;

      // Start image cycling
      interval = setInterval(next, duration);

      // Setup resize handler
      resizeHandler = async () => {
        const imageSize = await measureImageHeights(
          preloadedImages,
          imageStyle
        );
        maxHeight = imageSize.height;
      };

      window.addEventListener("resize", resizeHandler);
    }

    setup(); // Trigger the async logic

    // Cleanup logic (non-async)
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeHandler);
    };
  });
</script>

{#if preloadedImages}
  <div
    class="image-container flex justify-center items-center md:items-start"
    style={`--max-height: ${maxHeight}px;`}
  >
    {#each preloadedImages as item, i}
      {#if i === current && visible}
        <div
          in:fade={{ duration: fadeDuration }}
          out:fade={{ duration: fadeDuration }}
        >
          <img class={imageStyle} src={item.src} {alt} />
        </div>
      {/if}
    {/each}
  </div>
{:else}
  <div class="font-bold text-7xl text-center h-[50vh]">Loading Images...</div>
{/if}

<style>
  .image-container {
    height: var(--max-height);
  }
</style>
