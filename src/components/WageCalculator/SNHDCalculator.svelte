<script lang="ts">
  import FormDropdown from "../Forms/FormDropdown.svelte";
  import Table from "../Forms/Table.svelte";
  import WageHourlyInput from "./WageHourlyInput.svelte";
  import {
    formatPercentage,
    formatCurrency,
    getMeritIncreaseValue,
  } from "../util";

  let wage: number = 0;
  let hours: number = 40;
  let meritIncreasesString: string;

  // 2024 / 2025
  let firstHourlyString: string;
  let firstGrossString: string;

  // 2025 / 2026
  let secondHourlyString: string;
  let secondGrossString: string;

  function calculate() {
    const meritIncreaseValue = getMeritIncreaseValue(meritIncreasesString);
    const yearlyHours = hours * 52;

    // 2024 / 2025
    const firstHourlyValue = wage * 1.05 * meritIncreaseValue;
    firstHourlyString = formatCurrency(firstHourlyValue);
    firstGrossString = formatCurrency(firstHourlyValue * yearlyHours);

    // 2025 / 2026
    const secondHourlyValue = firstHourlyValue * 1.04 * meritIncreaseValue;
    secondHourlyString = formatCurrency(secondHourlyValue);
    secondGrossString = formatCurrency(secondHourlyValue * yearlyHours);
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
    <div class="flex flex-col py-4">
      <div class="text-black font-bold text-lg text-center md:text-left">
        Include Merit Increases?
      </div>
      <div class="md:mr-auto">
        <FormDropdown
          on:update={(e) => {
            meritIncreasesString = e.detail.value;
            calculate();
          }}
          dropdownOptions={["Topped Out", "2.5%"]}
        />
      </div>
    </div>
  </form>
  <Table
    headers={[
      "Time Period",
      "Percent Increase",
      "New Hourly Wage",
      "New Annual Gross",
    ]}
    rows={[
      ["2024 / 2025", "5%", firstHourlyString, firstGrossString],
      ["2025 / 2026", "4%", secondHourlyString, secondGrossString],
    ]}
  />
</div>
