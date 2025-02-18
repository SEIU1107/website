import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import mkcert from "vite-plugin-mkcert";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), mdx()],
  outDir: "../html",
  redirects: {},
  vite: {
    plugins: [mkcert()],
    server: {
      https: true,
    }
  }
});