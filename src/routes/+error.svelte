<script lang="ts">
	import { ChevronLeft } from '@lucide/svelte';
</script>

<div class="text-center py-12 space-y-4">
	<h1 class="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
	<p class="text-xl text-gray-600 dark:text-gray-400">Page not found</p>
	<p class="text-gray-500 dark:text-gray-500 mb-8">The Pokémon you're looking for doesn't exist.</p>
	<a
		href="/"
		class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
	>
		<ChevronLeft size={20} />
		Back to Pokédex
	</a>
</div>
