<script lang="ts">
import "./layout.css";
import { onMount } from "svelte";
import { themeStore } from "$lib/stores/theme";

let { children } = $props();
let isDark = $state(false);

onMount(() => {
  const unsubscribe = themeStore.subscribe((theme) => {
    isDark = theme === "dark";
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  });
  return unsubscribe;
});

function toggleTheme() {
  themeStore.set(isDark ? "light" : "dark");
}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
	<header class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
		<nav class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold text-red-600 dark:text-red-500 hover:scale-105 transition-transform">
				Pokédex
			</a>
			<div class="flex items-center gap-4">
				<a href="/" class="hover:text-red-600 dark:hover:text-red-400 transition-colors">List</a>
				<a href="/berries" class="hover:text-red-600 dark:hover:text-red-400 transition-colors">Berries</a>
				<a href="/favorites" class="hover:text-red-600 dark:hover:text-red-400 transition-colors">Favorites</a>
				<button
					onclick={toggleTheme}
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					aria-label="Toggle theme"
				>
					{#if isDark}
						<Sun size={20} />
					{:else}
						<Moon size={20} />
					{/if}
				</button>
			</div>
		</nav>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8">
		{@render children()}
	</main>

	<footer class="border-t border-gray-200 dark:border-gray-800 mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
		<p>Pokédex powered by <a href="https://pokeapi.co" class="underline hover:text-red-600">PokéAPI</a></p>
	</footer>
</div>
