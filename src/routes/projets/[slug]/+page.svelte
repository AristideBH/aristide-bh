<script lang="ts">
	import { page } from '$app/state';
	import Image from '$lib/components/image/Image.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	import type { PageData } from './$types';

	let { data }: { data: PageData | Record<string, any> } = $props();
	let { project } = data;
</script>

<MetaTags
	title={project?.seo_details?.meta_title}
	description={project?.seo_details?.meta_description}
	titleTemplate="%s | Aristide BH"
/>

{#if !page.state.shallow}
	<!-- <Header /> -->
{/if}

<!-- <pre>{JSON.stringify(project, null, 2)}</pre> -->

<Section>
	<h1>{project?.title}</h1>
	<h2>{project?.subtitle}</h2>
</Section>

<Section>
	<Image item={project?.thumbnail!} />
</Section>
