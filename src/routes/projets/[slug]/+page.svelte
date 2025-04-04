<script lang="ts">
	import { page } from '$app/state';
	import Image from '$lib/components/image/Image.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	import type { PageData } from './$types';

	let { data }: { data: PageData | Record<string, any> } = $props();
	let { project } = data;
	let isShallow = page.state.shallow;
</script>

<MetaTags
	title={project?.seo_details?.meta_title}
	description={project?.seo_details?.meta_description}
	titleTemplate="%s | Aristide BH"
/>

<Section>
	<Image item={project?.thumbnail!} />
</Section>

<Section class={isShallow ? 'px-8 pt-4' : ''} content={{ template: 'inherit-main' }}>
	<h1>{project?.title}</h1>
	<h2>{project?.subtitle}</h2>
</Section>

<pre>{JSON.stringify(project, null, 2)}</pre>
