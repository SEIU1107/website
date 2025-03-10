<script lang="ts">
  import DropdownInput from "../Forms/DropdownInput.svelte";

  let selectedLang: string = "en";
  let translations: Record<string, Record<string, string>> = {}; // Cache translations

  async function translateText(
    text: string,
    targetLang: string
  ): Promise<string> {
    if (!text.trim()) return text; // Skip empty text
    if (targetLang == "en") {
      return text;
    }

    // Retrieve cached translations from localStorage
    const cachedTranslations = JSON.parse(
      localStorage.getItem("translations") || "{}"
    );

    // Check if translation already exists in localStorage
    if (cachedTranslations[targetLang]?.[text]) {
      return cachedTranslations[targetLang][text];
    }

    console.log(`Translating ${text} to ${targetLang}`);

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCZ8sDU_5IgKmtfTECHlWgGUGk_Himn-ec&q=${encodeURIComponent(
        text
      )}&target=${targetLang}`
    );
    const data = await response.json();

    const translatedText: string =
      data?.data?.translations?.[0]?.translatedText || text;

    // Update local storage cache
    cachedTranslations[targetLang] = cachedTranslations[targetLang] || {};
    cachedTranslations[targetLang][text] = translatedText;
    localStorage.setItem("translations", JSON.stringify(cachedTranslations));

    return translatedText;
  }

  async function translatePage(): Promise<void> {
    // console.log(`Translating to ${selectedLang}`);
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
      "*:not(script):not(style):not(meta):not(link):not([data-no-translate] *)"
    );

    console.log({ elements });

    for (const el of elements) {
      for (const node of el.childNodes) {
        if (node.nodeType === 3 && node.nodeValue?.trim()) {
          // Only translate text nodes
          const textNode = node as Text;
          (textNode as any).originalText =
            (textNode as any).originalText || textNode.nodeValue;
          // console.log(`before: ${textNode.nodeValue}`);
          textNode.nodeValue = await translateText(
            (textNode as any).originalText,
            selectedLang
          );
          // console.log(`after: ${textNode.nodeValue}`);
        }
      }
    }
  }
</script>

<div data-no-translate>
  <DropdownInput
    dropdownOptions={[
      { label: "Default", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "Tagalog", value: "tl" },
    ]}
    dropdownHoverStyle="px-4 w-full py-1 hover:bg-supernova-100 hover:text-honey-flower-800 cursor-pointer"
    textSize="text-xs sm:text-sm"
    textColor="text-honey-flower-800"
    color="bg-supernova-400"
    hoverColor="bg-supernova-500"
    update={(val: string) => {
      selectedLang = val;
      // console.log({ selectedLang });
      translatePage();
    }}
  />
</div>
