<script lang="ts">
  import DropdownInput from "../Forms/DropdownInput.svelte";

  let selectedLang: string = "en";
  let translations: Record<string, string> = {}; // Cache translations

  async function translateText(
    text: string,
    targetLang: string
  ): Promise<string> {
    // console.log(`Translating ${text} to ${targetLang}`);
    if (!text.trim()) return text; // Skip empty text
    if (targetLang == "en") {
      return text;
    }

    // if (translations[text]) return translations[text]; // Use cached translation

    /*
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY&q=${encodeURIComponent(
        text
      )}&target=${targetLang}`
    );
    const data = await response.json();
    */

    const data = {
      data: {
        translations: [
          {
            translatedText: `${text} in ${targetLang}`,
          },
        ],
      },
    };

    const translatedText: string =
      data?.data?.translations?.[0]?.translatedText || text;

    translations[text] = translatedText; // Cache translation
    return translatedText;
  }

  async function translatePage(): Promise<void> {
    // console.log(`Translating to ${selectedLang}`);
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
      "*:not(script):not(style):not(meta):not(link)"
    );

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
