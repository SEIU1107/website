<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  export let text = "Enter text";
  export let onClick: MouseEventHandler<HTMLButtonElement> | undefined =
    undefined;
  export let href: string | undefined = undefined;
  export let styling =
    "text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest";
  export let target: string | undefined = undefined;

  const classString =
    "inline-block rounded-md px-2 py-2 text-center uppercase tracking-wide focus:outline-none focus:ring focus:ring-offset-white transition duration-200".concat(
      " ".concat(styling)
    );
</script>

{#if href}
  <a {href} class={classString} {target}>{text}</a>
{:else if onClick}
  <button on:click={onClick} class={classString}>{text}</button>
{/if}
