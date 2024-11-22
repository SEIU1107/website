<script lang="ts">
  export let headers: string[] = [""];
  export let rows: Array<
    Array<
      | string
      | HTMLElement
      | { component: typeof SvelteComponent; props?: Record<string, any> }
    >
  > = [[]];
  // Styling
  export let headerTextSize = "text-sm md:text-md lg:text-lg";
  export let headerTextColor = "text-supernova-300";
  export let headerColor = "bg-honey-flower-950";

  export let textColor = "text-honey-flower-50";
  export let textSize = "text-md md:text-lg lg:text-xl";

  export let oddBg = "odd:bg-honey-flower-700";
  export let evenBg = "even:bg-honey-flower-900";

  export let borderColor = "border-supernova-500";
</script>

<div class="relative overflow-x-auto shadow-md rounded-lg">
  <table
    class={`${headerColor} max-w-[95vw] md:max-w-full text-center md:text-left`}
  >
    <thead
      class={`${headerColor} ${headerTextSize} ${headerTextColor} uppercase`}
    >
      <tr>
        {#each headers as header}
          <th scope="col" class="px-2 sm:px-4 md:px-6 py-4 lg:py-6">{header}</th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i}
        <tr
          class={`${textColor} ${textSize} ${evenBg} ${oddBg} ${i !== rows.length - 1 ? `${borderColor} border-b` : ""}`}
        >
          {#each row as cell}
            <td class="px-2 sm:px-4 py-4 lg:py-6">
              {#if typeof cell == "string"}
                {cell}
              {:else if cell?.html}
                {@html cell.html}
              {:else if cell?.component}
                <svelte:component
                  this={cell.component}
                  on:update={(e) => {
                    if (cell.props?.["on:update"]) {
                      cell.props["on:update"](e);
                    }
                  }}
                  {...cell.props}
                />
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
