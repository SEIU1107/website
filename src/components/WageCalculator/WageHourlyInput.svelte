<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function updateWage(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch("wageUpdate", {
      value: target ? Math.max(Number(target.value), 0) : 0,
    });
  }

  function updateHours(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch("hoursUpdate", {
      value: target ? Math.max(Number(target.value), 0) : 0,
    });
  }
</script>

<div class="flex flex-col lg:grid lg:grid-cols-2 mr-auto">
  <div class="lg:mr-2">
    <label
      for="number-input"
      class="block mb-2 text-lg text-honey-flower-900 font-bold"
      >Enter Your Hourly Wage</label
    >

    <input
      on:input={updateWage}
      type="number"
      id="number-input"
      aria-describedby="helper-text-explanation"
      class="bg-gray-50 border border-gray-300 text-black placeholder:text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
      on:input={updateHours}
      type="number"
      id="number-input"
      aria-describedby="helper-text-explanation"
      class="bg-gray-50 border border-gray-300 text-black placeholder:text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      placeholder="40"
      required
    />
  </div>
</div>
