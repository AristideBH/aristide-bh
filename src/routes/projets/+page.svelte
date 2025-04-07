<script lang="ts">
	import Section from '$lib/components/layout/Section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Section>
	<h1>Projets</h1>
	<p class="font-mono italic text-primary">Une liste non-exhaustives de mes réalisations</p>
</Section>

<Section content={{ template: 'inherit-main' }}>
	<div class="block-wrapper">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi minus aliquid corrupti,
			impedit, odit quos fugiat accusamus inventore aut, eius quasi nesciunt officia hic quo placeat
			dolore magnam veniam delectus.
		</p>
	</div>
	<aside class=" block-wrapper col-start-3 -col-end-1">
		<h2>filters</h2>
	</aside>
</Section>
