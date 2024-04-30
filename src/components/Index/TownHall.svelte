<script>
  import { onMount } from "svelte";
  import Button from "../Button.svelte";

  let isEnglish = true;

  // Images
  const englishImageUrl =
    "/assets/Home Care Legislative Town Hall postcard for SEIU 1107_v1 English-1.png";
  const spanishImageUrl =
    "/assets/Home Care Legislative Town Hall postcard for SEIU 1107_v1 Spanish-1.png";

  let imageUrl = englishImageUrl;

  function toggleLanguage() {
    imageUrl = isEnglish ? spanishImageUrl : englishImageUrl;
    isEnglish = !isEnglish;
  }

  // Function to initialize language based on browser language
  function initializeLanguage() {
    const browserLanguage = navigator.language.toLowerCase();
    isEnglish = browserLanguage.includes("en");
    imageUrl = isEnglish ? englishImageUrl : spanishImageUrl;
  }

  // Initialize language on component mount
  onMount(() => {
    initializeLanguage();
  });
</script>

<div class="flex flex-col justify-center">
  <div class="mx-auto my-5">
    <Button
      onClick={toggleLanguage}
      styling="bg-supernova-400 hover:bg-supernova-500 text-honey-flower-800 hover:scale-110 active:bg-supernova-600 scale-125"
    >
      {isEnglish ? "Español" : "English"}
    </Button>
  </div>
  <img
    src={imageUrl}
    alt="Home Care Town Hall"
    class="max-w-screen-lg m-auto px-10 py-5"
  />
</div>
