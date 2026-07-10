<script lang="ts">
import { onMount } from "svelte";
import { fetchBerryDetail, fetchBerryList } from "$lib/api";
import type { BerryDetail } from "$lib/api/schemas";

let berries: BerryDetail[] = $state([]);
let isLoading = $state(true);

async function loadBerries() {
  try {
    const list = await fetchBerryList();
    if (!list) {
      return;
    }

    const details = await Promise.all(
      list.results.slice(0, 30).map((r) => fetchBerryDetail(r.name))
    );
    berries = details.filter((d) => d !== null);
  } catch (error) {
    console.error("Failed to load berries:", error);
  } finally {
    isLoading = false;
  }
}

onMount(() => loadBerries());
</script>

<div class="space-y-6">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-white">Berries</h1>

	{#if isLoading}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">Loading berries...</p>
		</div>
	{:else if berries.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">No berries found.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each berries as berry (berry.id)}
				<a
					href="/berries/{berry.name}"
					class="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 transition-all p-6 hover:shadow-lg hover:-translate-y-1"
				>
					<h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors capitalize mb-3">
						{capitalizeFirst(berry.name)}
					</h3>
					<div class="space-y-2 text-sm">
						<p class="text-gray-600 dark:text-gray-400">
							<span class="font-semibold">Firmness:</span> {capitalizeFirst(berry.firmness.name)}
						</p>
						<p class="text-gray-600 dark:text-gray-400">
							<span class="font-semibold">Growth Time:</span> {berry.growth_time} hours
						</p>
						<p class="text-gray-600 dark:text-gray-400">
							<span class="font-semibold">Size:</span> {berry.size} mm
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
