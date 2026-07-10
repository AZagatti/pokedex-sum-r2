import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: "404.html",
      precompress: false,
    }),
    paths: {
      base: "/pokedex-sum-r2",
    },
    prerender: {
      handleUnseenRoutes: "warn",
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
