<script lang="ts">
  import FormDropdown from "../Forms/FormDropdown.svelte";
  import Table from "../Forms/Table.svelte";
  import Subtitle from "../Subtitle.svelte";
  import { formatPercentage, formatCurrency } from "../util";
  let wage: number = 0;
  let hours: number = 40;

  // Can be "Topped Out", "3.4%", "2.5%", or "1.5%"
  let meritIncreasesString = "Topped Out";

  // Only if there are merit increases
  let attendaceMerit = false;
  let totalMerit = 0;

  // String Variables for rendering on the table

  // 2024 / 2025
  let firstHourlyString: string;
  let firstGrossString: string;

  // 2025 / 2026
  let secondHourlyLow: string;
  let secondGrossLow: string;
  let secondHourlyHigh: string;
  let secondGrossHigh: string;

  // 2026 / 2027
  let thirdHourlyLow: string;
  let thirdHourlyHigh: string;
  let thirdGrossLow: string;
  let thirdGrossHigh: string;

  // 2027 / 2028
  let fourthHourlyLow: string;
  let fourthHourlyHigh: string;
  let fourthGrossLow: string;
  let fourthGrossHigh: string;

  function calculate() {
    const meritIncreaseValue =
      getMeritIncreaseValue() +
      (meritIncreasesString !== "Topped Out" && attendaceMerit ? 0.005 : 0);
    const yearlyHours = hours * 52;

    totalMerit = meritIncreaseValue;

    // 2024 / 2025
    const firstHourlyVal = wage * 1.045 * meritIncreaseValue;
    firstHourlyString = formatCurrency(firstHourlyVal);
    firstGrossString = formatCurrency(firstHourlyVal * yearlyHours);

    // 2025 / 2026
    const secondHourlyLowVal = firstHourlyVal * 1.025 * meritIncreaseValue;
    const secondHourlyHighVal = firstHourlyVal * 1.035 * meritIncreaseValue;
    secondHourlyLow = formatCurrency(secondHourlyLowVal);
    secondHourlyHigh = formatCurrency(secondHourlyHighVal);
    secondGrossLow = formatCurrency(secondHourlyLowVal * yearlyHours);
    secondGrossHigh = formatCurrency(secondHourlyHighVal * yearlyHours);

    // 2026 / 2027
    const thirdHourlyLowVal = secondHourlyLowVal * 1.02 * meritIncreaseValue;
    const thirdHourlyHighVal = secondHourlyHighVal * 1.03 * meritIncreaseValue;
    thirdHourlyLow = formatCurrency(thirdHourlyLowVal);
    thirdHourlyHigh = formatCurrency(thirdHourlyHighVal);
    thirdGrossLow = formatCurrency(thirdHourlyLowVal * yearlyHours);
    thirdGrossHigh = formatCurrency(thirdHourlyHighVal * yearlyHours);

    // 2027 / 2028
    const fourthHourlyLowVal = thirdHourlyLowVal * 1.02 * meritIncreaseValue;
    const fourthHourlyHighVal = thirdHourlyHighVal * 1.03 * meritIncreaseValue;
    fourthHourlyLow = formatCurrency(fourthHourlyHighVal);
    fourthHourlyHigh = formatCurrency(fourthHourlyHighVal);
    fourthGrossLow = formatCurrency(fourthHourlyLowVal * yearlyHours);
    fourthGrossHigh = formatCurrency(fourthHourlyHighVal * yearlyHours);
  }

  function updateWage(event: Event) {
    const target = event.target as HTMLInputElement;
    wage = target ? Math.max(Number(target.value), 0) : 0;
    calculate();
  }

  function updateHours(event: Event) {
    const target = event.target as HTMLInputElement;
    hours = target ? Math.max(Number(target.value), 0) : 0;
    calculate();
  }

  function getMeritIncreaseValue(): number {
    switch (meritIncreasesString) {
      case "3.4%":
        return 1.034;
      case "2.5%":
        return 1.025;
      case "1.5%":
        return 1.015;
    }
    return 1;
  }
</script>

<div class="flex flex-col">
  <form class="mx-auto">
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
          on:input={updateHours}
          type="number"
          id="number-input"
          aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="40"
          required
        />
      </div>
    </div>
    <div class="pt-5 grid grid-cols-2">
      <div class="px-1">
        <div class="text-black font-bold text-lg italic">Merit Increase</div>
        <FormDropdown
          on:update={(e) => {
            meritIncreasesString = e.detail.value;
            if (meritIncreasesString === "Topped Out") {
              attendaceMerit = false;
            }
            calculate();
          }}
          dropdownOptions={["Topped Out", "3.4%", "2.5%", "1.5%"]}
        />
      </div>
      {#if meritIncreasesString !== "Topped Out"}
        <div class="px-1">
          <div class="text-black font-bold text-lg italic">
            Attendance Merit?
          </div>
          <FormDropdown
            on:update={(e) => {
              attendaceMerit = e.detail.value === "Yes";
              calculate();
            }}
            dropdownOptions={["No", "Yes"]}
          />
        </div>
      {/if}
    </div>
  </form>
  <div class="mr-auto py-5">
    {#if meritIncreasesString !== "Topped Out"}
      <span class="font-bold font-italic text-md"
        >Merit Increase{attendaceMerit ? " (including Attendance)" : ""}: {formatPercentage(
          totalMerit - 1
        )}</span
      >
    {/if}
    <Table
      headers={[
        "Time Period",
        "Percent Increase",
        "New Hourly Wage",
        "New Annual Gross",
      ]}
      rows={[
        ["2024 / 2025", "4.5% Increase", firstHourlyString, firstGrossString],
        [
          "2025 / 2026",
          "2.5% - 3.5% Increase",
          `${secondHourlyLow} - ${secondHourlyHigh}`,
          `${secondGrossLow} - ${secondGrossHigh}`,
        ],
        [
          "2026 / 2027",
          "2% - 3% Increase",
          `${thirdHourlyLow} - ${thirdHourlyHigh}`,
          `${thirdGrossLow} - ${thirdGrossHigh}`,
        ],
        [
          "2027 / 2028",
          "2% - 3% Increase",
          `${fourthHourlyLow} - ${fourthHourlyHigh}`,
          `${fourthGrossLow} - ${fourthGrossHigh}`,
        ],
      ]}
    />
  </div>
</div>
