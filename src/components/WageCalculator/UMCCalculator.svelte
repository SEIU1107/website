<script lang="ts">
  let wage: number = 0;

  // Can be "Topped Out", "3.4%", "2.5%", or "1.5%"
  let meritIncreases = "Topped Out";
  let attendaceMerit = false;

  let dropdownOpen = false;

  const dropdownHoverStyle =
    "block px-4 py-2 hover:bg-supernova-300 hover:text-honey-flower-800";
</script>

<div class="flex flex-col">
  <form class="mx-auto">
    <div class="flex flex-col lg:grid lg:grid-cols-2">
      <div class="lg:mr-2">
        <label
          for="number-input"
          class="block mb-2 text-lg text-honey-flower-900 font-bold"
          >Enter Your Hourly Wage</label
        >
        <input
          type="number"
          id="number-input"
          aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter Your Wage"
          required
        />
      </div>
      <div class="lg:ml-2">
        <label
          for="number-input"
          class="block mb-2 text-lg text-honey-flower-900 font-bold"
          >Enter Your Weekly Hours</label
        >
        <input
          type="number"
          id="number-input"
          aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="40"
          required
        />
      </div>
    </div>

    <div class="py-2">
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
          class={"text-honey-flower-100 bg-honey-flower-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-t-lg text-md px-5 py-2.5 text-center inline-flex items-center".concat(
            " ",
            dropdownOpen ? "bg-honey-flower-900 rounded-br-lg" : "rounded-b-lg"
          )}
          type="button"
          >Dropdown hover <svg
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
        </button>

        <!-- Dropdown menu -->
        {#if dropdownOpen}
          <div
            id="dropdownHover"
            class="z-10 bg-honey-flower-900 divide-y divide-gray-100 rounded-b-lg rounded-tr-lg shadow w-44"
          >
            <ul
              class="py-2 text-md text-honey-flower-100"
              aria-labelledby="dropdownHoverButton"
            >
              <li>
                <a href="#" class={dropdownHoverStyle}>Tapped Out</a>
              </li>
              <li>
                <a href="#" class={dropdownHoverStyle}>3.4%</a>
              </li>
              <li>
                <a href="#" class={dropdownHoverStyle}>2.5%</a>
              </li>
              <li>
                <a href="#" class={dropdownHoverStyle}>1.5%</a>
              </li>
            </ul>
          </div>
        {/if}
      </form>
    </div>
  </form>
</div>
