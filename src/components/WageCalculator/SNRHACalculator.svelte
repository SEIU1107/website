<script lang="ts">
  import WageHourlyInput from "./WageHourlyInput.svelte";
  import DropdownInput from "../Forms/DropdownInput.svelte";
  import Table from "../Forms/Table.svelte";
  import {
    getMeritIncreaseValue,
    formatCurrency,
    formatPercentage,
  } from "../util";

  let wage: number = 0;
  let hours: number = 40;

  // 2024 / 2025
  let firstMeritIncrease: string;
  let firstHourlyString: string;
  let firstGrossString: string;

  // 2025 / 2026
  let secondMeritIncrease: string;
  let secondHourlyString: string;
  let secondGrossString: string;

  // 2026 / 2027
  let thirdMeritIncrease: string;
  let thirdHourlyString: string;
  let thirdGrossString: string;

  // Totals
  let totalIncreasePercentage: string;
  let totalIncreaseHourly: string;
  let totalIncreaseGross: string;
  function calculate() {
    const yearlyHours = hours * 52;

    // 2024 / 2025
    const firstMeritIncreaseValue = getMeritIncreaseValue(firstMeritIncrease);
    const firstHourlyValue = wage * 1.05 * firstMeritIncreaseValue;
    const firstGrossVal = firstHourlyValue * yearlyHours;
    firstHourlyString = formatCurrency(firstHourlyValue);
    firstGrossString = formatCurrency(firstGrossVal);

    // 2025 / 2026
    const secondMeritIncreaseValue = getMeritIncreaseValue(secondMeritIncrease);
    const secondHourlyValue =
      firstHourlyValue * 1.03 * secondMeritIncreaseValue;
    secondHourlyString = formatCurrency(secondHourlyValue);
    secondGrossString = formatCurrency(secondHourlyValue * yearlyHours);

    // 2026 / 2027
    const thirdMeritIncreaseValue = getMeritIncreaseValue(thirdMeritIncrease);
    const thirdHourlyValue =
      secondHourlyValue * 1.025 * thirdMeritIncreaseValue;
    thirdHourlyString = formatCurrency(thirdHourlyValue);
    const thirdGrossVal = thirdHourlyValue * yearlyHours;
    thirdGrossString = formatCurrency(thirdGrossVal);

    totalIncreasePercentage = formatPercentage(
      wage !== 0 ? thirdHourlyValue / wage - 1 : 0
    );

    totalIncreaseHourly = formatCurrency(thirdHourlyValue - wage);
    totalIncreaseGross = formatCurrency(thirdGrossVal - firstGrossVal);
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
  </form>
  <div class="py-5">
    <Table
      textSize="text-sm md:text-md lg:text-lg"
      headers={[
        "Time Period",
        "Percent Increase",
        "Merit Increase",
        "New Hourly Wage",
        "New Annual Gross",
      ]}
      rows={[
        [
          "2024 / 2025",
          "5%",
          {
            component: DropdownInput,
            props: {
              dropdownHoverStyle:
                "px-4 w-full py-1 hover:bg-supernova-100 hover:text-honey-flower-800 cursor-pointer",
              dropdownOptions: ["2.5%", "Topped Out"],
              textSize: "text-xs sm:text-sm",
              textColor: "text-honey-flower-800",
              color: "bg-supernova-400",
              hoverColor: "bg-supernova-500",
              minWidth: "min-w-32 md:min-w-full",
              update: (val: string) => {
                firstMeritIncrease = val;
                calculate();
              },
            },
          },
          firstHourlyString,
          firstGrossString,
        ],
        [
          "2025 / 2026",
          "3%",
          {
            component: DropdownInput,
            props: {
              dropdownHoverStyle:
                "px-4 w-full py-1 hover:bg-supernova-100 hover:text-honey-flower-800 cursor-pointer",
              dropdownOptions: ["2.5%", "5%", "Topped Out"],
              textSize: "text-xs sm:text-sm",
              textColor: "text-honey-flower-800",
              color: "bg-supernova-400",
              hoverColor: "bg-supernova-500",
              minWidth: "min-w-32 md:min-w-full",
              update: (val: string) => {
                secondMeritIncrease = val;
                calculate();
              },
            },
          },
          secondHourlyString,
          secondGrossString,
        ],
        [
          "2026 / 2027",
          "2.5%",
          {
            component: DropdownInput,
            props: {
              dropdownHoverStyle:
                "px-4 w-full py-1 hover:bg-supernova-100 hover:text-honey-flower-800 cursor-pointer",
              dropdownOptions: ["2.5%", "5%", "Topped Out"],
              textSize: "text-xs sm:text-sm",
              textColor: "text-honey-flower-800",
              color: "bg-supernova-400",
              hoverColor: "bg-supernova-500",
              minWidth: "min-w-32 md:min-w-full",
              update: (val: string) => {
                thirdMeritIncrease = val;
                calculate();
              },
            },
          },
          thirdHourlyString,
          thirdGrossString,
        ],
        [
          { html: "<b style='padding-y: 200px;'>Total Increase:</b>" },
          totalIncreasePercentage,
          "",
          `+ ${totalIncreaseHourly} / hr`,
          `+ ${totalIncreaseGross} / year`,
        ],
      ]}
    />
  </div>
</div>
