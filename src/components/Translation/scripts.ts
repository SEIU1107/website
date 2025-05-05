import { all_dropdowns } from "../Header/NavData";
import { keysMatchSet, warningToast } from "../util";

// == Scripts for Translation Feature ==

// Supported Languages
export const languageCodes: Record<string, string> = {
  es: "Spanish",
  tl: "Tagalog",
  am: "Amharic",
};

// Response type expected from our endpoint containing translated terms.
// Keys are the original text. Values are the translated versions.
type TranslateResponseData = {
  translatedLayoutTokens: Record<string, string>;
  translatedTokens: Record<string, string>;
};

// Data type for the object that will be cached in the user's local storage
// to minimize duplicate translation requests to our endpoint.
export interface CachedTranslationData {
  [language: string]: {
    [pageName: string]: TranslateResponseData;
  };
}

let isTranslating = false;

export async function translatePage(selectedLang: string): Promise<void> {
  /* 
    
    Translates the entire page into the selectedLang
    
    Checks if the user has the most up-to-date translations already stored.

    If not, will call our API endpoint to grab the translations.
  */

  if (isTranslating) {
    // Re-entry guard to prevent multiple calls to the function at once

    return;
  }

  isTranslating = true;

  try {
    // Update the page name
    const currentPage = getPageKey();

    // Grab every element on the page
    const elements = Array.from(
      document.querySelectorAll(
        "*:not(script):not(style):not(meta):not(link):not([data-no-translate] *)"
      )
    );

    if (selectedLang === "en") {
      revertPage(elements);
      return;
    }

    // Grab the tokens for translation
    const allTokens = new Set(
      elements.flatMap((el) =>
        Array.from(el.childNodes)
          .filter((node) => node.nodeType === 3 && node.nodeValue?.trim())
          .map((node) => {
            const textNode = node as Text;
            return (textNode as any).originalText || textNode.nodeValue;
          })
      )
    );

    // Grab tokens from the Layout (so we don't re-translate them)
    const layoutTokens = new Set(
      all_dropdowns.flatMap((dropdown) => {
        const titles = [dropdown.title];
        const pages = dropdown.content?.map((item) => item.pageName) ?? [];
        return [...titles, ...pages];
      })
    );

    // Get the translation data from the cache or endpoint.
    const translationData = await getTranslationData(
      allTokens,
      layoutTokens,
      selectedLang,
      currentPage
    );

    // Apply Translations from the data
    for (const el of elements) {
      for (const node of el.childNodes) {
        if (node.nodeType === 3 && node.nodeValue?.trim()) {
          // Only translate text nodes
          const textNode = node as Text;
          (textNode as any).originalText =
            (textNode as any).originalText || textNode.nodeValue;
          textNode.nodeValue = translationData[(textNode as any).originalText];
        }
      }
    }
  } finally {
    isTranslating = false;
  }
}

function getPageKey(): string {
  /* 
    Updates the current page's name for use as a key
    in interim functions
    */

  const page = window.location.pathname;
  const trimmed = page.startsWith("/") ? page.slice(1) : page;
  return trimmed === "" ? "index" : trimmed;
}

function revertPage(elements: Element[]) {
  // Revert the entire page to the original text

  for (const el of elements) {
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.nodeValue?.trim()) {
        // Only translate text nodes
        const textNode = node as Text;
        (textNode as any).originalText =
          (textNode as any).originalText || textNode.nodeValue;
        textNode.nodeValue = (textNode as any).originalText;
      }
    }
  }
}

async function getTranslationData(
  allTokens: Set<string>,
  layoutTokens: Set<string>,
  selectedLang: string,
  currentPage: string
): Promise<Record<string, string>> {
  /*

    Determines if the user already has an up-to-date cached translation for
    the page in local storage, and returns it.

    If not, calls the endpoint for the translations and caches it.

    */

  // Retrieve cached translations from localStorage
  const cachedTranslationData = JSON.parse(
    localStorage.getItem("translations") || "{}"
  );

  // Separate the non-layout tokens from the layout ones.
  // Since layout tokens are present in every page, we don't need to keep re-translating them.
  const tokens = new Set(
    Array.from(allTokens).filter((item) => !layoutTokens.has(item))
  );

  // Determine if local storage already has the tokens
  if (
    isTranslationCached(
      cachedTranslationData,
      layoutTokens,
      tokens,
      selectedLang,
      currentPage
    )
  ) {
    // Up-to-date translation of this page into the selected language
    // is cached, just grab the translations from there.
    return {
      ...cachedTranslationData[selectedLang][currentPage].translatedTokens,
      ...cachedTranslationData[selectedLang][currentPage]
        .translatedLayoutTokens,
    };
  }

  // Send a toast message for the user since it might take some time
  // to grab the translation data from the endpoint.
  warningToast(
    `Translating to ${languageCodes[selectedLang]}, please wait...`,
    false,
    {
      initial: 0,
      next: 1,
      duration: 3000,
    }
  );

  // Otherwise, use API endpoint and cache the translations for the future.
  // Build request for API call
  const requestBody = {
    language: selectedLang,
    page: currentPage,
    layoutTokens: [...layoutTokens],
    tokens: [...tokens],
  };

  // Call endpoint
  const response = await fetch(import.meta.env.PUBLIC_TRANSLATE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data: TranslateResponseData = await response.json();

  const translatedLayoutTokens = data.translatedLayoutTokens;
  const translatedTokens = data.translatedTokens;

  // Cache the translations in the user's local storage for future use
  cacheTranslations(
    cachedTranslationData,
    translatedLayoutTokens,
    translatedTokens,
    selectedLang,
    currentPage
  );

  return { ...translatedLayoutTokens, ...translatedTokens };
}

function cacheTranslations(
  cachedTranslationData: CachedTranslationData,
  translatedLayoutTokens: Record<string, string>,
  translatedTokens: Record<string, string>,
  selectedLang: string,
  currentPage: string
) {
  /*
    
    Stores any translation data into the user's local storage under the "translations" key,
    to avoid duplicate translation requests to our endpoint in the future.
    
    */

  // Create new objects if needed
  cachedTranslationData[selectedLang] =
    cachedTranslationData[selectedLang] || {};
  cachedTranslationData[selectedLang][currentPage] =
    cachedTranslationData[selectedLang][currentPage] || {};

  cachedTranslationData[selectedLang][currentPage] = {
    translatedLayoutTokens,
    translatedTokens,
  };

  localStorage.setItem("translations", JSON.stringify(cachedTranslationData));
}

function isTranslationCached(
  cachedTranslationData: CachedTranslationData,
  layoutTokens: Set<string>,
  tokens: Set<string>,
  selectedLang: string,
  currentPage: string
): boolean {
  /*
    Determines of the cached translation data has the most up-to-date
    key-pair values for translating the page in question to the given language.
    */

  // If it's missing the language/page pair or doesn't exist at all, return false.
  if (
    !cachedTranslationData ||
    !cachedTranslationData[selectedLang] ||
    !cachedTranslationData[selectedLang][currentPage]
  ) {
    return false;
  }

  const pageTranslationEntry = cachedTranslationData[selectedLang][currentPage];

  // If it's missing either the layout tokens or non-layout tokens entry, return false.
  if (
    !pageTranslationEntry.translatedLayoutTokens ||
    !pageTranslationEntry.translatedTokens
  ) {
    return false;
  }

  const cachedLayoutTokens = pageTranslationEntry.translatedLayoutTokens;
  const cachedTokens = pageTranslationEntry.translatedTokens;
  return (
    keysMatchSet(layoutTokens, cachedLayoutTokens) &&
    keysMatchSet(tokens, cachedTokens)
  );
}
