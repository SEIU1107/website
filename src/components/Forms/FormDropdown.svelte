<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Options for the dropdown
  export let dropdownOptions: string[] = [""];

  // Styling of the dropdown options on hover
  export let dropdownHoverStyle =
    "px-4 w-full py-2 hover:bg-supernova-300 hover:text-honey-flower-800 cursor-pointer";

  // More styling options
  export let textColor = "text-honey-flower-100";
  export let color = "bg-honey-flower-800";
  export let hoverColor = "bg-honey-flower-900";
  export let minWidth = "min-w-full";
  export let textSize = "text-md";

  let dropdownOpen = false;
  let currOption: string | null = null;

  function updateOption(option: string) {
    currOption = option;
    dropdownOpen = false;
    dispatch("update", { value: currOption });
  }

  onMount(() => {
    // Initially set the current option to the first one
    updateOption(dropdownOptions[0]);
  });
</script>

<div class="py-2 relative">
  <form
    on:mouseleave={() => {
      dropdownOpen = false;
    }}
  >
    <button
      id="dropdownHoverButton"
      data-dropdown-toggle="dropdownHover"
      data-dropdown-trigger="hover"
      on:mouseenter={() => {
        dropdownOpen = true;
      }}
      class={`flex ${textSize} ${color} ${textColor} ${minWidth} focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-t-lg px-5 py-2.5 text-center items-center `.concat(
        dropdownOpen ? `rounded-br-lg ${hoverColor}` : "rounded-b-lg"
      )}
      type="button"
    >
      {currOption}

      <!-- Down Arrow -->
      <div class="ml-auto">
        <svg
          class="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
    </button>

    <!-- Dropdown menu -->
    {#if dropdownOpen}
      <div
        id="dropdownHover"
        class={`${hoverColor} ${minWidth} absolute z-10 rounded-b-lg rounded-tr-lg shadow-2xl`}
      >
        <ul
          class={`py-2 ${textSize} ${textColor}`}
          aria-labelledby="dropdownHoverButton"
        >
          {#each dropdownOptions as dropdownOption}
            <li>
              <button
                on:click={() => {
                  updateOption(dropdownOption);
                }}
                class={dropdownHoverStyle}
              >
                {dropdownOption}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </form>
</div>
