import { all_dropdowns } from "../Header/NavData";
import { warningToast } from "../util";

// Supported Languages
export const languageCodes: Record<string, string> = {
  es: "Spanish",
  tl: "Tagalog",
  am: "Amharic",
};

type TranslatedTerm = {
  term: string;
  dateLastAccesed: string; // Date this term was last translated
};

// Response type expected from our endpoint containing translated terms.
// Keys are the original text. Values are the translated versions.
type TranslateResponseData = {
  translatedTokens: Record<string, TranslatedTerm>;
  dateLastAccessed: string; // Date this page was last translated
};

// Data type for the object that will be cached in the user's local storage
// to minimize duplicate translation requests to our endpoint.
export interface CachedTranslationData {
  [language: string]: {
    [pageName: string]: TranslateResponseData;
  };
}

// Re-entry Guard to prevent duplicate calls to translate
let isTranslating = false;

// == Scripts for Translation Feature ==

function verifyCacheExists(
  cachedTranslationData: CachedTranslationData,
  selectedLang: string,
  pageKey: string,
  today: Date // ISO string that corresponds to today
): void {
  /*

  Ensures the object extracted from the user's localStorage has
  all the necessary keys in place initialized, to avoid any index errors
  when doing operations on them.

  Also sets the "date last accessed" attribute for the page in question to today.

  */

  const todayString = today.toISOString();

  // Create new objects if needed
  cachedTranslationData[selectedLang] ??= {};

  // Create a new instance for the page if needed, where the date accessed is today and the translations are empty.
  cachedTranslationData[selectedLang][pageKey] ??= {
    translatedTokens: {},
    dateLastAccessed: todayString,
  };

  // Ensure translatedTokens and dateLastAccessed are present to avoid
  // partial initialization bugs
  const entry = cachedTranslationData[selectedLang][pageKey];
  if (!entry.translatedTokens) {
    entry.translatedTokens = {};
  }
  if (!entry.dateLastAccessed) {
    entry.dateLastAccessed = todayString;
  }

  // Update the date last accessed to today
  cachedTranslationData[selectedLang][pageKey] = {
    ...cachedTranslationData[selectedLang][pageKey],
    dateLastAccessed: todayString,
  };
}

export async function translatePage(selectedLang: string): Promise<void> {
  /* 
    
    Translates the entire page into the selectedLang
    
    Checks if the user has the most up-to-date translations already stored.

    If not, will call our API endpoint to grab the translations.
  */

  // Re-entry guard to prevent multiple calls to the function at once
  if (isTranslating) {
    return;
  }

  isTranslating = true;

  try {
    // Grab every element on the page
    const elements = Array.from(
      document.querySelectorAll(
        "*:not(script):not(style):not(title):not(meta):not(link):not([data-no-translate] *)"
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

    // Separate the non-layout tokens from the layout ones.
    // Since layout tokens are present in every page, we don't need to keep re-translating them.
    const tokens = new Set(
      Array.from(allTokens).filter((item) => !layoutTokens.has(item))
    );

    // Get the Dates for today and a month ago for tagging the translations in the cache as
    // accessed today, and for pruning both page keys and translated terms that are over a month old.
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Get the translation data from the cache or endpoint.
    // Do it for layout tokens
    const layoutTranslations = await getPageTranslationData(
      layoutTokens,
      selectedLang,
      "layout", // "layout" is the key
      today,
      oneMonthAgo
    );

    // Do it for tokens not associated with the layout, and rather
    // associated with the page
    const pageTranslations = await getPageTranslationData(
      tokens,
      selectedLang,
      getPageKey(),
      today,
      oneMonthAgo
    );

    const translationData = { ...layoutTranslations, ...pageTranslations };

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

async function getPageTranslationData(
  tokens: Set<string>,
  selectedLang: string,
  pageKey: string,
  today: Date,
  oneMonthAgo: Date
): Promise<Record<string, string>> {
  /*

    Determines if the user already has an up-to-date cached translation for
    the page in local storage, and returns it. 

    If not, calls the endpoint for the translations and caches it.

    */

  // Retrieve cached translations from localStorage
  const cachedTranslationData: CachedTranslationData = JSON.parse(
    localStorage.getItem("translations") || "{}"
  );

  // Verify the shape of the cached translations are initialized properly
  // before performing any further operations
  verifyCacheExists(cachedTranslationData, selectedLang, pageKey, today);

  // Grab translations already present in local storage
  const cachedTranslations = updateAndPruneCachedTranslations(
    cachedTranslationData,
    tokens,
    selectedLang,
    pageKey,
    today,
    oneMonthAgo
  );

  // Determine if there are any missing tokens from the cache that still need translation
  // from the endpoint
  const missingTokens = [...tokens].filter(
    (token) => !(token in cachedTranslations)
  );

  // If there are missing tokens, we will need to call the endpoint.
  // Send a toast message for the user since it might take some time
  // to grab the translation data from the endpoint.
  if (missingTokens.length > 0) {
    if (pageKey !== "layout") {
      // NOTE: Don't send a toast for the layout tokens to avoid double messaging
      warningToast(
        `Translating to ${languageCodes[selectedLang]}, please wait...`,
        false,
        {
          initial: 0,
          next: 1,
          duration: 3000,
        }
      );
    }

    // Otherwise, use API endpoint and cache the translations for the future.
    // Build request for API call
    const requestBody = {
      language: selectedLang,
      page: pageKey,
      tokens: [...missingTokens],
    };
    // Call endpoint
    const response = await fetch(import.meta.env.PUBLIC_TRANSLATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Get the translations from the endpoint
    const data: TranslateResponseData = await response.json();

    console.log({ data });

    // Add it to the cache data
    const existingData = cachedTranslationData[selectedLang][pageKey];
    existingData.translatedTokens = {
      ...existingData.translatedTokens,
      ...data.translatedTokens,
    };

    // Cache the translations in the user's local storage for future use
    cacheAndPrunePageTranslations(
      cachedTranslationData,
      selectedLang,
      oneMonthAgo
    );

    // Add the new translations from the endpoint to our list of
    // translated tokens (from the cache) and return it
    return {
      ...cachedTranslations,
      ...Object.fromEntries(
        Object.entries(data.translatedTokens ?? {}).map(([key, value]) => [
          key,
          value.term,
        ])
      ),
    };
  }

  // Return the cached translations.
  return cachedTranslations;
}

function cacheAndPrunePageTranslations(
  cachedTranslationData: CachedTranslationData,
  selectedLang: string,
  oneMonthAgo: Date
) {
  /*
    
    Prunes the cache of any old pages (unaccessed for a month or longer) to save
    space on localStorage, then stores the updated translation data to the localStorage
    
  */

  // Prune cache of month-old unused pages
  const langData = cachedTranslationData[selectedLang];
  Object.entries(langData).forEach(([page, response]) => {
    const lastAccessed = new Date(response.dateLastAccessed);
    if (lastAccessed < oneMonthAgo) {
      delete langData[page];
    }
  });

  localStorage.setItem("translations", JSON.stringify(cachedTranslationData));
}

function updateAndPruneCachedTranslations(
  cachedTranslationData: CachedTranslationData,
  tokens: Set<string>,
  selectedLang: string,
  pageKey: string,
  today: Date,
  oneMonthAgo: Date
): Record<string, string> {
  /*
    Gets the required (as indicated by @tokens) translations from the cache for this page (if any exist).
    Secondly, it tags each of translations needed as "accessed today".
    Finally, it purges any translated terms for this page in the cache that have not been accessed in over a month.

    Returns the required translations in shape { original : translation }

    This function assumes the shape has been initialized properly.
  */

  const translatedTokens =
    cachedTranslationData[selectedLang][pageKey].translatedTokens;
  const updatedTokens: Record<string, TranslatedTerm> = Object.fromEntries(
    [...tokens]
      .filter((key) => translatedTokens[key]) // ensure the key exists
      .map((key) => [
        key,
        {
          ...translatedTokens[key],
          dateLastAccessed: today.toISOString(),
        },
      ])
  );

  // TODO: purge and translation keys within this page that are older than a month

  // Overwrite the filtered and updated tokens
  cachedTranslationData[selectedLang][pageKey].translatedTokens = {
    ...cachedTranslationData[selectedLang][pageKey].translatedTokens,
    ...updatedTokens,
  };

  // TODO: check if this is even necessary
  const newTokens =
    cachedTranslationData[selectedLang][pageKey].translatedTokens;

  // Return the translations as shape { original : translation }
  return Object.fromEntries(
    Object.entries(updatedTokens).map(([key, val]) => [key, val.term])
  );
}
