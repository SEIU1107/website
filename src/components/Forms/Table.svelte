<script lang="ts">
  export let headers: string[] = [""];
  export let rows: string[][] = [
    ["test", "test2", "test3"],
    ["test4", "test5"],
  ];
  // Styling
  export let headerTextSize = "text-sm md:text-md lg:text-lg";
  export let headerTextColor = "text-supernova-300";
  export let headerColor = "bg-honey-flower-950";

  export let textColor = "text-white";
  export let textSize = "text-md md:text-lg lg:text-xl";

  export let oddBg = "odd:bg-honey-flower-700";
  export let evenBg = "even:bg-honey-flower-900";
</script>

<div class="relative overflow-x-auto shadow-md rounded-lg">
  <table
    class={`${headerColor} max-w-[95vw] md:max-w-full text-center md:text-left`}
  >
    <thead
      class={`${headerColor} ${headerTextSize} ${headerTextColor} uppercase bg-gray-50`}
    >
      <tr>
        {#each headers as header}
          <th scope="col" class="px-4 md:px-6 py-4 lg:py-6">{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr class={`${textColor} ${textSize} ${evenBg} ${oddBg} border-b`}>
          {#each row as cell}
            <td class="px-4 md:px-6 py-4 lg:py-6">{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
