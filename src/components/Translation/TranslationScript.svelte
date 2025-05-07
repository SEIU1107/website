<script>
  import { onMount, onDestroy } from "svelte";

  let previousPathname = "";
  let lastLang = "";

  onMount(() => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const runTranslation = async () => {
      const lang = localStorage.getItem("selectedLang") || "en";
      if (lang === lastLang && window.location.pathname === previousPathname) {
        return;
      }

      // Retry a few times to allow DOM to stabilize
      for (let i = 0; i < 5; i++) {
        const { translatePage } = await import(
          "/src/components/Translation/scripts.ts"
        );
        translatePage(lang);
        await wait(100); // wait 100ms before next check
      }

      previousPathname = window.location.pathname;
      lastLang = lang;
    };

    const handleNavigation = () => {
      // Delay slightly after route change to allow DOM rendering
      setTimeout(runTranslation, 50);
    };

    // Initial run
    previousPathname = window.location.pathname;
    lastLang = localStorage.getItem("selectedLang") || "en";
    runTranslation();

    window.addEventListener("astro:after-swap", handleNavigation);

    return () => {
      window.removeEventListener("astro:after-swap", handleNavigation);
    };
  });

  onDestroy(() => {
    // Cleanup not strictly necessary here
  });
</script>
