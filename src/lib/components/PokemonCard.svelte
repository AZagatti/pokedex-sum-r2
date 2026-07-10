<script lang="ts">
import { favoritesStore } from "$lib/stores/favorites";

interface Props {
  id?: number;
  name: string;
  sprite: string | null;
  types: Array<{ type: { name: string } }>;
  url?: string;
}

let { name, sprite, types, url = "", id }: Props = $props();
let isFavorite = $state(favoritesStore.isFavorite(name));

const pokemonNumber = id ? String(id).padStart(4, "0") : "#0000";

function handleFavorite() {
  favoritesStore.toggle(name);
  isFavorite = favoritesStore.isFavorite(name);
}
</script>

<a
	href="/pokemon/{name}"
	class="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
>
	<div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
		{#if sprite}
			<PokemonImage src={sprite} alt={capitalizeFirst(name)} class="w-full h-full" />
		{:else}
			<div class="text-gray-400 dark:text-gray-600">No image</div>
		{/if}
		<button
			onclick={(e) => {
				e.preventDefault();
				handleFavorite();
			}}
			class="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform {isFavorite
				? 'text-red-500'
				: 'text-gray-400 hover:text-red-500'}"
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
		>
			<Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
		</button>
	</div>
	<div class="p-4">
		<div class="flex items-start justify-between mb-2">
			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400">#{pokemonNumber}</p>
				<h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
					{capitalizeFirst(name)}
				</h3>
			</div>
		</div>
		<TypeBadge {types} class="text-xs" />
	</div>
</a>
