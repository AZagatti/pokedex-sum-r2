<script lang="ts">
export interface Props {
  class?: string;
}

let { class: className = "" }: Props = $props();
</script>

<div class="skeleton rounded-lg overflow-hidden {className}">
	<div class="aspect-square skeleton" />
	<div class="p-4 space-y-3">
		<div class="h-4 skeleton rounded w-3/4" />
		<div class="h-3 skeleton rounded w-1/2" />
		<div class="flex gap-2">
			<div class="h-6 skeleton rounded-full w-16" />
			<div class="h-6 skeleton rounded-full w-16" />
		</div>
	</div>
</div>
