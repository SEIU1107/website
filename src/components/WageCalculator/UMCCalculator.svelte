<script lang="ts">
  import FormDropdown from "../Forms/FormDropdown.svelte";
  import Table from "../Forms/Table.svelte";
  import Subtitle from "../Subtitle.svelte";
  import WageHourlyInput from "./WageHourlyInput.svelte";
  import {
    formatPercentage,
    formatCurrency,
    getMeritIncreaseValue,
  } from "../util";
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
      getMeritIncreaseValue(meritIncreasesString) +
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
    fourthHourlyLow = formatCurrency(fourthHourlyLowVal);
    fourthHourlyHigh = formatCurrency(fourthHourlyHighVal);
    fourthGrossLow = formatCurrency(fourthHourlyLowVal * yearlyHours);
    fourthGrossHigh = formatCurrency(fourthHourlyHighVal * yearlyHours);
  }
</script>

<div class="flex flex-col">
  <form class="mx-auto">
    <WageHourlyInput
      on:hoursUpdate={(e) => {
        hours = e.detail.value;
        calculate();
      }}
      on:wageUpdate={(e) => {
        wage = e.detail.value;
        calculate();
      }}
    />
    <div class="pt-5 grid grid-cols-2">
      <div class="px-1">
        <div class="text-black font-bold text-lg">Merit Increase</div>
        <FormDropdown
          update={(val: string) => {
            meritIncreasesString = val;
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
          <div class="text-black font-bold text-lg">Attendance Merit?</div>
          <FormDropdown
            update={(val: string) => {
              attendaceMerit = val === "Yes";
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
    {:else}
      <span class="font-bold font-italic text-md"
        >No Merit Increases Applied</span
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
        ["2024 / 2025", "4.5%", firstHourlyString, firstGrossString],
        [
          "2025 / 2026",
          "2.5% - 3.5%",
          `${secondHourlyLow} - ${secondHourlyHigh}`,
          `${secondGrossLow} - ${secondGrossHigh}`,
        ],
        [
          "2026 / 2027",
          "2% - 3%",
          `${thirdHourlyLow} - ${thirdHourlyHigh}`,
          `${thirdGrossLow} - ${thirdGrossHigh}`,
        ],
        [
          "2027 / 2028",
          "2% - 3%",
          `${fourthHourlyLow} - ${fourthHourlyHigh}`,
          `${fourthGrossLow} - ${fourthGrossHigh}`,
        ],
      ]}
    />
  </div>
</div>
