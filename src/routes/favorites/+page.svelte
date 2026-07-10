<script lang="ts">
	import { favoritesStore } from '$lib/stores/favorites';
	import { fetchPokemonDetail } from '$lib/api';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import type { PokemonDetail } from '$lib/api/schemas';

	let favorites: PokemonDetail[] = $state([]);
	let isLoading = $state(true);

	$effect(async () => {
		isLoading = true;
		let faves: string[] = [];
		const unsub = favoritesStore.subscribe((current) => {
			faves = Array.from(current);
		});

		try {
			const details = await Promise.all(
				faves.map((name) => fetchPokemonDetail(name))
			);
			favorites = details.filter((d) => d !== null);
		} catch (error) {
			console.error('Failed to load favorites:', error);
		} finally {
			isLoading = false;
			unsub();
		}
	});
</script>

<div class="space-y-6">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-white">Favorite Pokémon</h1>

	{#if isLoading}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	{:else if favorites.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400 text-lg">No favorites yet!</p>
			<p class="text-gray-500 dark:text-gray-500">Add Pokémon to your favorites from the main list.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each favorites as pokemon (pokemon.id)}
				<PokemonCard
					name={pokemon.name}
					sprite={pokemon.sprites.other?.['official-artwork']?.front_default ||
						pokemon.sprites.front_default}
					types={pokemon.types}
					id={pokemon.id}
				/>
			{/each}
		</div>
	{/if}
</div>
