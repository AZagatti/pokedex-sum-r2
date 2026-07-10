<script lang="ts">
interface Props {
  class?: string;
  types: Array<{ type: { name: string } }>;
}

let { types, class: className = "" }: Props = $props();
</script>

<div class="flex flex-wrap gap-2 {className}">
	{#each types as typeObj}
		{@const type = typeObj.type.name}
		{@const color = getTypeColor(type)}
		<span class="{color.bg} {color.text} px-3 py-1 rounded-full text-sm font-semibold">
			{capitalizeFirst(type)}
		</span>
	{/each}
</div>
