<script lang="ts">
import { onMount } from "svelte";
import { fetchPokemonDetail, fetchPokemonList } from "$lib/api";
import type { PokemonDetail } from "$lib/api/schemas";

let pokemonList: PokemonDetail[] = $state([]);
let isLoading = $state(false);
let hasMore = $state(true);
let offset = $state(0);
const LIMIT = 30;

let searchQuery = $state("");
let selectedTypes = $state<string[]>([]);
let selectedGen = $state<number | null>(null);
let sortBy = $state<"number" | "stats">("number");

let allTypes: string[] = $state([]);
let filteredList: PokemonDetail[] = $state([]);

let sentinelElement: HTMLDivElement | null = null;

async function loadInitial() {
  isLoading = true;
  pokemonList = [];
  offset = 0;
  hasMore = true;
  await loadMore();
  isLoading = false;
}

async function loadMore() {
  if (isLoading || !hasMore) {
    return;
  }
  isLoading = true;

  try {
    const list = await fetchPokemonList(LIMIT, offset);
    if (!list || list.results.length === 0) {
      hasMore = false;
      isLoading = false;
      return;
    }

    const details = await Promise.all(
      list.results.map((r) => fetchPokemonDetail(r.name))
    );
    pokemonList = [...pokemonList, ...details.filter((d) => d !== null)];
    offset += LIMIT;
    hasMore = list.next !== null;
  } catch (error) {
    console.error("Failed to load pokémon:", error);
    hasMore = false;
  } finally {
    isLoading = false;
  }
}

function applyFilters() {
  let result = [...pokemonList];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (selectedTypes.length > 0) {
    result = result.filter((p) =>
      selectedTypes.some((t) => p.types.some((pt) => pt.type.name === t))
    );
  }

  if (sortBy === "stats") {
    result.sort(
      (a, b) => (b.stats[0]?.base_stat || 0) - (a.stats[0]?.base_stat || 0)
    );
  }

  filteredList = result;
}

function clearFilters() {
  searchQuery = "";
  selectedTypes = [];
  selectedGen = null;
  sortBy = "number";
  applyFilters();
}

function toggleType(type: string) {
  if (selectedTypes.includes(type)) {
    selectedTypes = selectedTypes.filter((t) => t !== type);
  } else {
    selectedTypes = [...selectedTypes, type];
  }
  applyFilters();
}

onMount(() => {
  allTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  loadInitial();

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    { threshold: 0.1 }
  );

  if (sentinelElement) {
    observer.observe(sentinelElement);
  }

  return () => observer.disconnect();
});

$effect(() => {
  applyFilters();
});
</script>

<div class="space-y-6">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-white">Pokédex</h1>

	<!-- Filters -->
	<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sticky top-20 z-40 space-y-4">
		<!-- Search -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Search by name..."
				class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
			/>
		</div>

		<!-- Type Filter -->
		<div>
			<p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Types</p>
			<div class="grid grid-cols-4 md:grid-cols-6 gap-2">
				{#each allTypes as type}
					<button
						onclick={() => toggleType(type)}
						class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all {selectedTypes.includes(
							type
						)
							? 'bg-red-500 text-white border-red-600'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300'}"
					>
						{type}
					</button>
				{/each}
			</div>
		</div>

		<!-- Sort -->
		<div class="flex items-center gap-4">
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="number"
					class="accent-red-500"
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300">Sort by Number</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="radio"
					bind:group={sortBy}
					value="stats"
					class="accent-red-500"
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300">Sort by Base Stats</span>
			</label>
		</div>

		<!-- Clear Filters -->
		{#if searchQuery || selectedTypes.length > 0 || sortBy !== 'number'}
			<button
				onclick={clearFilters}
				class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
			>
				<X size={18} />
				Clear Filters
			</button>
		{/if}
	</div>

	<!-- Results -->
	{#if filteredList.length === 0 && pokemonList.length > 0}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400 text-lg">No Pokémon match your filters.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each filteredList as pokemon (pokemon.id)}
				<PokemonCard
					name={pokemon.name}
					sprite={pokemon.sprites.other?.['official-artwork']?.front_default ||
						pokemon.sprites.front_default}
					types={pokemon.types}
					id={pokemon.id}
				/>
			{/each}

			{#if isLoading}
				{#each Array(LIMIT) as _}
					<PokemonCardSkeleton />
				{/each}
			{/if}
		</div>
	{/if}

	<div bind:this={sentinelElement} class="h-4" />

	{#if !hasMore && filteredList.length > 0}
		<div class="text-center py-8 text-gray-500 dark:text-gray-400">
			<p>No more Pokémon to load</p>
		</div>
	{/if}
</div>
