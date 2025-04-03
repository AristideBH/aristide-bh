<script lang="ts">
	import { page } from '$app/state';
	import Image from '$lib/components/image/Image.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Section from '$lib/components/layout/Section.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData | Record<string, any> } = $props();
	let { project } = data;
</script>

{#if !page.state.shallow}
	<Header />
{/if}

<Section>
	<h1>{project?.title}</h1>
	<h2>{project?.subtitle}</h2>
</Section>

<Section>
	<Image item={project?.thumbnail!} />
</Section>
