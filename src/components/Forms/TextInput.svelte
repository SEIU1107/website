<script lang="ts">
  import { onMount } from "svelte";

  let {
    // When true, the placeholder is the initial value, otherwise the initial value is ''
    usePlaceholderAsDefault = false,

    // If Rows > 0, create a text area large text input instead.
    rows = 0,

    // Placeholder to put in the text box
    placeholder = "",
    maxlength = 500,
    styling = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5",
    update, // Handles the current value of the input
  } = $props();

  let value = $state("");

  onMount(() => {
    update(usePlaceholderAsDefault ? placeholder : "");
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
