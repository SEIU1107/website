import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  outDir: "../html",
  redirects: {
    '/communities_united': '/communities_united_2023'
  }
});