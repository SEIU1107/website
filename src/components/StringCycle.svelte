<script lang="ts">
  /* Cycles through a list of strings given a duration and stying */

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  export let items: string[] = []; // List of strings to display
  export let duration = 2000; // Time each string is displayed (in milliseconds)
  export let textStyle = "text-black text-xl";

  let current = 0;
  let visible = true;

  function next() {
    visible = false;
    setTimeout(() => {
      current = (current + 1) % items.length;
      visible = true;
    }, 1000); // This delay should match the fade duration
  }

  // Start the cycling effect when the component is mounted
  onMount(() => {
    const interval = setInterval(next, duration);
    return () => clearInterval(interval);
  });
</script>

{#each items as item, i}
  {#if i === current && visible}
    <div
      class={textStyle}
      in:fade={{ duration: 1000 }}
      out:fade={{ duration: 1000 }}
    >
      {item}
    </div>
  {/if}
{/each}
