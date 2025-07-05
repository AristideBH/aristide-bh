<script lang="ts">
	import { browser } from '$app/environment';
	import Image from '$lib/components/image/Image.svelte';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button';
	import { formatText } from '$lib/logic/strings';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Video from '$lib/components/image/Video.svelte';
	import MediaDiscriminator from '$lib/components/image/MediaDiscriminator.svelte';

	let { data }: { data: PageData | Record<string, any> } = $props();
	let { project } = data;

	let description = $state('');
	if (browser) {
		onMount(() => {
			const rawAbout = project?.description!;
			description = formatText(rawAbout);
		});
	}
</script>

<svelte:head>
	<title>{project?.seo?.title ? project?.seo?.title : 'Projet'} | Aristide BH</title>
	<meta
		name="description"
		content={project?.seo?.meta_description
			? project?.seo?.meta_description
			: 'Découvrir ce projet'}
	/>
</svelte:head>

<Section content={{ template: 'inherit-main' }}>
	<Image
		item={project?.thumbnail!}
		loading="eager"
		class="aspect-project min-h-96 rounded-t-none"
	/>
	<div class="block-wrapper col-span-full flex flex-col gap-8">
		<hgroup class=" flex flex-col gap-2">
			<h1 style="--wght: 500;">{project?.title}</h1>
			<p class="font-mono italic text-primary">{project?.subtitle}</p>
		</hgroup>
		{#if project.tags?.length}
			<div class=" flex flex-wrap gap-3">
				{#each project.tags as tag}
					<Badge variant="secondary" class="pointer-events-none">{tag.title}</Badge>
				{/each}
			</div>
		{/if}
	</div>
	{#if project.description}
		<div class="block-wrapper !col-auto">
			<div class="">{@html description}</div>
		</div>
	{/if}
	{#if project.site_url}
		<div class="block-wrapper col-start-3">
			<Button href={project.site_url} size={'lg'} target="_blank" class=" w-full">
				Voir le site
				<ExternalLink class="ml-1 size-4" />
			</Button>
		</div>
	{/if}
</Section>

{#if project.gallery?.length}
	<Section>
		<div class="flex flex-col gap-y-12">
			{#each project.gallery as image, id}
				{@const topGap = (id + 1) * 2}
				<MediaDiscriminator item={image.directus_files_id} {topGap} />
			{/each}
		</div>
	</Section>
{/if}

<Section content={{ width: 'full-width' }} class="pb-24">
	<p class="lead pb-8">
		Ce projet vous a plu ? Vous avez un projet similaire (ou pas) en tête ?
		<br />
		N'hésitez pas à me contacter !
	</p>
	<ContactMarquee />
</Section>
