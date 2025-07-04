<script lang="ts">
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { projects } = data;
</script>

<Section>
	<h1>Projets</h1>
	<p class="font-mono italic text-primary">Une liste non-exhaustives de mes réalisations</p>
</Section>

<Section content={{ template: 'inherit-main' }}>
	{#if projects}
		<div class=" grid grid-cols-1 gap-4">
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</Section>
