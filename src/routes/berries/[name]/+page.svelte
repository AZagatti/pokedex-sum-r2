<script lang="ts">
import { page } from "$app/stores";
import { fetchBerryDetail } from "$lib/api";
import type { BerryDetail } from "$lib/api/schemas";

let berry: BerryDetail | null = $state(null);
let isLoading = $state(true);
let error: string | null = $state(null);

const name = $page.params.name;

async function loadBerry() {
  try {
    const detail = await fetchBerryDetail(name);
    if (!detail) {
      throw new Error("Berry not found");
    }
    berry = detail;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load berry";
  } finally {
    isLoading = false;
  }
}

$effect(() => {
  loadBerry();
});
</script>

<div class="space-y-8 max-w-2xl">
	<a href="/berries" class="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline">
		<ChevronLeft size={20} />
		Back to Berries
	</a>

	{#if isLoading}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
			<p class="text-red-800 dark:text-red-200">{error}</p>
		</div>
	{:else if berry}
		<div>
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white capitalize mb-4">
				{capitalizeFirst(berry.name)}
			</h1>

			<div class="grid grid-cols-2 gap-4 mb-8">
				<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
					<p class="text-sm text-gray-600 dark:text-gray-400">Firmness</p>
					<p class="text-2xl font-bold text-red-600 dark:text-red-400 capitalize">
						{capitalizeFirst(berry.firmness.name)}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
					<p class="text-sm text-gray-600 dark:text-gray-400">Growth Time</p>
					<p class="text-2xl font-bold text-red-600 dark:text-red-400">{berry.growth_time}h</p>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Flavors</h2>
				<div class="space-y-3">
					{#each berry.flavors as flavor}
						<div class="flex items-center justify-between">
							<span class="capitalize">{flavor.flavor.name}</span>
							<div class="flex items-center gap-2">
								<div class="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
									<div
										class="bg-red-500 h-2 rounded-full"
										style="width: {(flavor.potency / 10) * 100}%"
									/>
								</div>
								<span class="text-sm text-gray-600 dark:text-gray-400">{flavor.potency}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
