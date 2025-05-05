<script lang="ts">
  import DropdownInput from "../Forms/DropdownInput.svelte";
  import { onMount } from "svelte";
  import { languageCodes, translatePage } from "./scripts";
  let isMounted = false;
  let selectedLang: string;

  onMount(() => {
    const cachedLangOnMount = localStorage.getItem("selectedLang") || "";
    console.log({ cachedLangOnMount });
    if (cachedLangOnMount !== "en") {
      selectedLang = cachedLangOnMount;
    } else {
      selectedLang = "en";
    }
    console.log({ selectedLang });
    isMounted = true;
  });
</script>

{#if isMounted}
  <div data-no-translate>
    <DropdownInput
      dropdownOptions={[
        { label: "English", value: "en" },
        ...Object.entries(languageCodes).map(([code, name]) => ({
          label: name,
          value: code,
        })),
      ]}
      dropdownHoverStyle="px-4 w-full py-1 hover:bg-supernova-100 hover:text-honey-flower-800 cursor-pointer"
      textSize="text-xs sm:text-sm"
      textColor="text-honey-flower-800"
      color="bg-supernova-400"
      hoverColor="bg-supernova-500"
      initialValue={selectedLang}
      update={(val: string) => {
        selectedLang = val;
        localStorage.setItem("selectedLang", selectedLang);
        console.log("translation cuz dropdown");
        translatePage(selectedLang);
      }}
    />
  </div>
{/if}
