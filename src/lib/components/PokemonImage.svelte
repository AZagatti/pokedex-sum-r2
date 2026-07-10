<script lang="ts">
	interface Props {
		src: string | null;
		alt: string;
		class?: string;
	}

	let { src, alt, class: className = '' }: Props = $props();
</script>

<img
	{src}
	{alt}
	class="object-contain {className}"
	loading="lazy"
	decoding="async"
/>

<style>
	img {
		display: block;
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
