<script lang="ts">
  /* Cycles through a bunch of images given a duration and stying */
  /* Be sure to import the images beforehand! */

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import type { ImageMetadata } from "astro";

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

  // Preload all images
  function preloadImages() {
    preloadedImages = images.map((img) => {
      const image = new Image();
      image.src = img.src;
      image.className = imageStyle;
      return image;
    });
  }

  // Measure the height of each image and determine the maximum height
  function measureImageHeights() {
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.visibility = "hidden";
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "-9999px";
    document.body.appendChild(hiddenContainer);

    const imageElements = preloadedImages.map((img) => {
      const image = new Image();
      image.src = img.src;
      image.className = imageStyle;
      hiddenContainer.appendChild(image);
      return image;
    });

    Promise.all(
      imageElements.map(
        (img) =>
          new Promise<number>((resolve) => {
            img.onload = () => resolve(img.height);
          })
      )
    ).then((heights: number[]) => {
      maxHeight = Math.max(...heights);
      document.body.removeChild(hiddenContainer);
      console.log(`Max height calculated: ${maxHeight}px`);
    });
  }

  onMount(() => {
    // Preload images on component mount
    preloadImages();

    // Measure the maximum height of this component based on the
    // largest image in the list
    measureImageHeights();

    // Re-measure the height if the window size changes
    window.addEventListener("resize", measureImageHeights);

    // Start the cycling effect when the component is mounted
    const interval = setInterval(next, duration);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", measureImageHeights);
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
