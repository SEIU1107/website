<script lang="ts">
  import HeadingTitle from "../HeadingTitle.svelte";
  import UMCCalculator from "./UMCCalculator.svelte";
  let currShop: string = "UMC";
</script>

<HeadingTitle
  text={currShop ? `${currShop} Wage Calculator` : "Wage Calculator"}
/>
<div class="py-2 mx-auto">
  {#if currShop === "UMC"}
    <UMCCalculator />
  {/if}
</div>
