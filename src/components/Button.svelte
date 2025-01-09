<script lang="ts">
  const {
    // Button Label
    text = null,

    // For when the button simply leads to another page
    href = null,
    target = null,

    // function to run upon clicking, if href is not used
    onClick = null,

    // Style options
    styling = "no-underline not-prose text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest",

    // Children for rendering in the button (above text)
    children = null,
  } = $props();

  const classString =
    "inline-block rounded-md px-2 py-2 text-center uppercase tracking-wide focus:outline-none focus:ring focus:ring-offset-white transition duration-200".concat(
      " ".concat(styling)
    );
</script>

{#if href}
  <a {href} class={classString} {target}>
    {@render children?.()}
    {#if text}
      {text}
    {/if}
  </a>
{:else if onClick}
  <button onclick={onClick} class={classString}>
    {@render children?.()}
    {#if text}
      {text}
    {/if}
  </button>
{/if}
