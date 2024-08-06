<script lang="ts">
  /* Cycles through a bunch of images given a duration and stying */
  /* Be sure to import the images beforehand! */

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import type { ImageMetadata } from "astro";

  export let images: ImageMetadata[] = []; // List of strings to display
  export let duration = 2000; // Time each string is displayed (in milliseconds)
  export let imageStyle: string = "";

  let current = 0;
  let visible = true;

  function next() {
    visible = false;
    setTimeout(() => {
      current = (current + 1) % images.length;
      visible = true;
    }, 500); // This delay should match the fade duration
  }

  // Start the cycling effect when the component is mounted
  onMount(() => {
    const interval = setInterval(next, duration);
    return () => clearInterval(interval);
  });
</script>

<div>
  {#each images as item, i}
    {#if i === current && visible}
      <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <img class={imageStyle} src={item.src} alt="" />
      </div>
    {/if}
  {/each}
</div>
