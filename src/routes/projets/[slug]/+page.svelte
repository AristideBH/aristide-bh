<script lang="ts">
	import Image from '$lib/components/image/Image.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { MetaTags } from 'svelte-meta-tags';
	import type { PageData } from './$types';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';

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
		<hgroup class=" flex flex-col gap-2">
			<h1 style="--wght: 500;">{project?.title}</h1>
			<p class="">{project?.subtitle}</p>
		</hgroup>
		{#if project.tags?.length}
			<div class=" flex flex-wrap gap-3">
				{#each project.tags as tag}
					<Badge variant="secondary" class="pointer-events-none">{tag.title}</Badge>
				{/each}
			</div>
		{/if}
		<div class="[&>p]:lead [&>p]:text-balance">{@html project.description}</div>
		{#if project.site_url}
			<Button href={project.site_url} size={'lg'} target="_blank" class=" w-fit">
				Voir le site
				<ExternalLink class="mr-1 size-4" />
			</Button>
		{/if}
	</div>
</Section>

{#if project.gallery?.length}
	<Section>
		<div class="flex flex-col gap-y-12">
			{#each project.gallery as image, id}
				{@const topGap = (id + 1) * 2}
				<Image
					item={image.directus_files_id}
					class="!sticky h-full min-h-[70dvh] border border-muted/20 "
					style={`top: ${topGap}rem;`}
				/>
			{/each}
		</div>
	</Section>
{/if}

<Section content={{ width: 'full-width' }} class="pb-24">
	<p class="lead pb-8">
		Ce projet vous à plu ?
		<br /> Vous avez un projet similaire (ou pas) en tête ?
		<br />
		N'hésitez pas à me contacter !
	</p>
	<ContactMarquee />
</Section>
