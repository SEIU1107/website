<script lang="ts">
  import Button from "../Button.svelte";
  import HeadingTitle from "../HeadingTitle.svelte";
  import Subtitle from "../Subtitle.svelte";
  import UMCCalculator from "./UMCCalculator.svelte";
  import SNHDCalculator from "./SNHDCalculator.svelte";
  import SNRHACalculator from "./SNRHACalculator.svelte";

  let currShop: string | null = null;

  const shops = ["UMC", "SNRHA", "SNHD"];
</script>

<HeadingTitle
  text={currShop ? `${currShop} Wage Calculator` : "Wage Calculator"}
/>
<div class="mx-auto">
  {#if currShop === "UMC"}
    <UMCCalculator />
  {:else if currShop == "SNRHA"}
    <SNRHACalculator />
  {:else if currShop == "SNHD"}
    <SNHDCalculator />
  {:else}
    <Subtitle text="Select Employer:" />
    <div class="py-5 flex flex-col md:flex-row">
      {#each shops as shop}
        <div class="px-5 py-2 md:py-0.5 mx-auto">
          <Button
            styling="text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest scale-125 hover:scale-[145%]"
            text={shop}
            onClick={() => {
              currShop = shop;
            }}
          />
        </div>
      {/each}
    </div>
  {/if}
  {#if currShop}
    <div class="pt-5">
      <Subtitle text="Other Wage Calculators" />
      <div class="max-w-sm flex flex-row mx-auto">
        {#each shops as shop}
          <div class="py-2 mx-auto">
            <Button
              text={shop}
              onClick={() => {
                currShop = shop;
              }}
            />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
