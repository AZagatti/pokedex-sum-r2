<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPokemonDetail, fetchPokemonSpecies, fetchEvolutionChain } from '$lib/api';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { favoritesStore } from '$lib/stores/favorites';
	import { capitalizeFirst, getPokemonNumber } from '$lib/utils';
	import { Heart, ChevronLeft, Volume2 } from '@lucide/svelte';
	import type { PokemonDetail } from '$lib/api/schemas';

	interface EvolutionNode {
		species: { name: string; url: string };
		evolves_to: EvolutionNode[];
	}

	let pokemon: PokemonDetail | null = $state(null);
	let isLoading = $state(true);
	let error: string | null = $state(null);
	let isFavorite = $state(false);
	let spriteMode = $state<'front' | 'back' | 'shiny'>('front');
	let evolutionChain: EvolutionNode[] = $state([]);

	const name = $page.params.name;

	async function loadPokemon() {
		try {
			const detail = await fetchPokemonDetail(name);
			if (!detail) throw new Error('Pokémon not found');

			pokemon = detail;
			isFavorite = favoritesStore.isFavorite(name);

			if (pokemon.species?.url) {
				const species = await fetchPokemonSpecies(pokemon.species.url.split('/').slice(-2)[0]);
				if (species?.evolution_chain) {
					const chainUrl = species.evolution_chain.url;
					const chainId = chainUrl.split('/').slice(-2)[0];
					const chain = await fetchEvolutionChain(chainId);
					if (chain) {
						evolutionChain = chain.chain.evolves_to ? [chain.chain] : [];
					}
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load Pokémon';
		} finally {
			isLoading = false;
		}
	}

	function toggleFavorite() {
		favoritesStore.toggle(name);
		isFavorite = favoritesStore.isFavorite(name);
	}

	function getSprite(): string | null {
		if (!pokemon) return null;
		switch (spriteMode) {
			case 'back':
				return pokemon.sprites.back_default;
			case 'shiny':
				return pokemon.sprites.front_shiny || pokemon.sprites.front_default;
			default:
				return pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
		}
	}

	function playCry() {
		if (pokemon?.cries?.latest) {
			const audio = new Audio(pokemon.cries.latest);
			audio.play().catch(() => console.log('Audio play failed'));
		}
	}

	$effect(() => {
		loadPokemon();
	});

	function flattenEvolutions(node: EvolutionNode): string[] {
		let result = [node.species.name];
		for (const child of node.evolves_to) {
			result = result.concat(flattenEvolutions(child));
		}
		return result;
	}
</script>

<div class="space-y-8">
	<a href="/" class="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline">
		<ChevronLeft size={20} />
		Back to Pokédex
	</a>

	{#if isLoading}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
			<p class="text-red-800 dark:text-red-200">{error}</p>
		</div>
	{:else if pokemon}
		<div class="grid md:grid-cols-2 gap-8">
			<!-- Artwork & Details -->
			<div class="space-y-6">
				<div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg aspect-square flex items-center justify-center relative">
					<PokemonImage
						src={getSprite()}
						alt={capitalizeFirst(pokemon.name)}
						class="w-full h-full max-w-md"
					/>
					<button
						onclick={toggleFavorite}
						class="absolute top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform {isFavorite
							? 'text-red-500'
							: 'text-gray-400 hover:text-red-500'}"
					>
						<Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
					</button>
				</div>

				<!-- Sprite Variants -->
				<div class="flex gap-2">
					{#each ['front', 'back', 'shiny'] as mode}
						<button
							onclick={() => (spriteMode = mode)}
							class="flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all border-2 {spriteMode === mode
								? 'bg-red-500 text-white border-red-600'
								: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300'}"
						>
							{capitalizeFirst(mode)}
						</button>
					{/each}
					<button
						onclick={playCry}
						class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
						aria-label="Play cry"
					>
						<Volume2 size={20} />
					</button>
				</div>

				<!-- Base Stats -->
				<div class="space-y-3">
					<h3 class="font-bold text-lg">Base Stats</h3>
					{#each pokemon.stats.slice(0, 6) as stat}
						<div class="space-y-1">
							<div class="flex justify-between items-center text-sm">
								<span class="font-semibold">{capitalizeFirst(stat.stat.name)}</span>
								<span class="text-gray-600 dark:text-gray-400">{stat.base_stat}</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
								<div
									class="bg-red-500 h-full transition-all duration-500"
									style="width: {Math.min((stat.base_stat / 150) * 100, 100)}%"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Info -->
			<div class="space-y-6">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">#{pokemon.id.toString().padStart(4, '0')}</p>
					<h1 class="text-4xl font-bold text-gray-900 dark:text-white">{capitalizeFirst(pokemon.name)}</h1>
				</div>

				<div>
					<h3 class="font-bold text-lg mb-2">Types</h3>
					<TypeBadge types={pokemon.types} />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Height</p>
						<p class="text-lg font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
					</div>
					<div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Weight</p>
						<p class="text-lg font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
					</div>
				</div>

				<div>
					<h3 class="font-bold text-lg mb-2">Abilities</h3>
					<div class="space-y-2">
						{#each pokemon.abilities as ability}
							<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
								<span class="capitalize">{ability.ability.name.replace('-', ' ')}</span>
								{#if ability.is_hidden}
									<span class="text-xs bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
										Hidden
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				{#if pokemon.moves && pokemon.moves.length > 0}
					<div>
						<h3 class="font-bold text-lg mb-2">Moves</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each pokemon.moves.slice(0, 6) as move}
								<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm capitalize">
									{move.move.name.replace('-', ' ')}
								</div>
							{/each}
						</div>
						{#if pokemon.moves.length > 6}
							<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">+{pokemon.moves.length - 6} more</p>
						{/if}
					</div>
				{/if}

				{#if evolutionChain.length > 0}
					<div>
						<h3 class="font-bold text-lg mb-2">Evolution Chain</h3>
						<div class="flex gap-2 flex-wrap">
							{#each flattenEvolutions(evolutionChain[0]) as evo}
								<a
									href="/pokemon/{evo}"
									class="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors capitalize"
								>
									{evo.replace('-', ' ')}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
