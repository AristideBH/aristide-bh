<script lang="ts">
	import Image from '$lib/components/image/Image.svelte';
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

<Section content={{ width: 'full-width' }}>
	<Image item={project?.thumbnail!} loading="eager" class="aspect-project" />
</Section>

<Section content={{ template: 'inherit-main' }}>
	<div class="block-wrapper flex flex-col gap-8">
		<hgroup class="flex flex-col gap-2">
			<h1 style="--wght: 500;">{project?.title}</h1>
			<p class="small">{project?.subtitle}</p>
		</hgroup>
		<div class="[&>p]:lead">{@html project.description}</div>
		<!-- <pre>{JSON.stringify(project, null, 2)}</pre> -->
	</div>
</Section>
