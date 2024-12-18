<script lang="ts">
  import { onMount } from "svelte";

  let {
    // Initial value, if any, which will already be present in the text box upon mounting
    initialValue = "",

    // If Rows > 0, create a text area large text input instead.
    rows = 0,

    // Placeholder to put in the text box when empty
    placeholder = "",

    // When true, the placeholder is the initial value sent via update(), WITHOUT a value present in the text box.
    // Otherwise, the initial value is used
    usePlaceholderAsDefault = false,

    maxlength = 500,
    styling = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5",
    update, // Signals to parent component the current value.
  } = $props();

  let value = $state(initialValue);

  onMount(() => {
    update(usePlaceholderAsDefault ? placeholder : initialValue);
  });
</script>

{#if rows}
  <textarea
    oninput={() => {
      update(value);
    }}
    {rows}
    bind:value
    {maxlength}
    {placeholder}
    id="default-input"
    class={styling}
  ></textarea>
{:else}
  <input
    oninput={() => {
      update(value);
    }}
    bind:value
    {maxlength}
    {placeholder}
    type="text"
    id="default-input"
    class={styling}
  />
{/if}
