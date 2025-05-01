import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import mkcert from "vite-plugin-mkcert";
import svelte from "@astrojs/svelte";

const isCustomOutput = process.env.ASTRO_OUTDIR === "html";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), mdx()],
  ...(isCustomOutput && { outDir: "../html" }),
  redirects: {},
  vite: {
    plugins: [mkcert()],
    server: {
      https: true,
    },
  },
});