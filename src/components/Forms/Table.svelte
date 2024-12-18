<script lang="ts">
  type TableCell =
    | string
    | { html: string }
    | { component: any; props?: Record<string, any> };

  export let headers: string[] = [""];
  export let rows: Array<Array<TableCell>> = [[]];
  // Styling
  export let headerTextSize = "text-sm md:text-md lg:text-lg";
  export let headerTextColor = "text-supernova-300";
  export let headerColor = "bg-honey-flower-950";

  export let textColor = "text-honey-flower-50";
  export let textSize = "text-md md:text-lg lg:text-xl";

  export let oddBg = "odd:bg-honey-flower-700";
  export let evenBg = "even:bg-honey-flower-900";

  export let borderColor = "border-supernova-500";

  // Type guards for TableCell
  const isHtmlCell = (cell: TableCell): cell is { html: string } =>
    typeof cell === "object" && "html" in cell;

  const isComponentCell = (
    cell: TableCell
  ): cell is { component: any; props?: Record<string, any> } =>
    typeof cell === "object" && "component" in cell;
</script>

<div
  class="relative overflow-x-auto max-w-[95vw] md:max-w-full text-center md:text-left shadow-md rounded-lg"
>
  <table class={`${headerColor}`}>
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
              {:else if isHtmlCell(cell)}
                {@html cell.html}
              {:else if isComponentCell(cell)}
                <svelte:component
                  this={cell.component}
                  update={(e: any) => {
                    if (cell.props?.["update"]) {
                      cell.props["update"](e);
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
