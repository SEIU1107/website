<script lang="ts">
  import DropdownInput from "../Forms/DropdownInput.svelte";

  let selectedLang: string = "en";
  // let charCount: number = 0;

  async function translateText(
    text: string,
    targetLang: string
  ): Promise<string> {
    if (!text.trim()) return text; // Skip empty text
    // charCount = charCount + text.length;
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

    // return text;

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
    // Grab every element on the page
    const elements = Array.from(
      document.querySelectorAll(
        "*:not(script):not(style):not(meta):not(link):not([data-no-translate] *)"
      )
    ) as HTMLElement[];

    // Grab the tokens for translation
    const tokens = elements.flatMap((el) =>
      Array.from(el.childNodes)
        .filter((node) => node.nodeType === 3 && node.nodeValue?.trim())
        .map((node) => {
          const textNode = node as Text;
          return (textNode as any).originalText || textNode.nodeValue;
        })
    );

    console.log({ tokens });
  }
</script>

<div data-no-translate>
  <DropdownInput
    dropdownOptions={[
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "Tagalog", value: "tl" },
      { label: "Amharic", value: "am" },
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
