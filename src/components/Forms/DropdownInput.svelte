<script lang="ts">
  import { onMount } from "svelte";

  const {
    // Options for the dropdown
    dropdownOptions = [""],

    // Initial value, if any, to already be selected
    initialValue = "",

    // Styling of the dropdown options on hover
    dropdownHoverStyle = "px-4 w-full py-2 hover:bg-supernova-300 hover:text-honey-flower-800 cursor-pointer",

    // More styling optons
    textColor = "text-honey-flower-100",
    color = "bg-honey-flower-800",
    hoverColor = "bg-honey-flower-900",
    minWidth = "min-w-full",
    textSize = "text-md",

    // Updates value chosen
    update,
  } = $props();

  let dropdownOpen = $state(false);
  let currOption: string | null = $state(null);

  function updateOption(option: string | null) {
    currOption = option;
    dropdownOpen = false;
    update(option);
  }

  onMount(() => {
    // Initially set the current option to the first one
    if (initialValue) {
      // Dev wants an initial value...
      if (dropdownOptions.find((val) => initialValue === val)) {
        // And it's provided in dropdownOptions! Hurray!
        currOption = initialValue;
      } else {
        // ... but it's not available. Default to first value.
        currOption = dropdownOptions[0];
        console.error(
          `Defaulting to first option '${currOption}', as initial value '${initialValue}' wasn't found in the options provided: ${dropdownOptions}`
        );
      }
    } else {
      currOption = dropdownOptions[0];
    }

    updateOption(currOption);
  });
</script>

<div class="relative">
  <form
    onmouseleave={() => {
      dropdownOpen = false;
    }}
  >
    <button
      id="dropdownHoverButton"
      data-dropdown-toggle="dropdownHover"
      data-dropdown-trigger="hover"
      onmouseenter={() => {
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
                onclick={() => {
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
