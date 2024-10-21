<script lang="ts">
  import HeadingTitle from "../HeadingTitle.svelte";
  import Subtitle from "../Subtitle.svelte";
  import UMCCalculator from "./UMCCalculator.svelte";
  let currShop: string = "UMC";
</script>

<HeadingTitle
  text={currShop ? `${currShop} Wage Calculator` : "Wage Calculator"}
/>
<div class="py-2">
  {#if currShop === "UMC"}
    <UMCCalculator />
  {/if}
</div>
