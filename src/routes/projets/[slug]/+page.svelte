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
	import Gallery from './Gallery.svelte';
	import Marqueeck from '@arisbh/marqueeck';

	let { data }: { data: PageData | Record<string, any> } = $props();
	let { project, gallery } = data;

	let subtitle = $state('');
	let description = $state('');
	if (browser) {
		onMount(() => {
			const rawAbout = project?.description!;
			description = formatText(rawAbout);
			const rawSubtitle = project?.subtitle!;
			subtitle = formatText(rawSubtitle);
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
		class="max-h-[45vh] min-h-[25rem] rounded-t-none"
	/>
	<div class="block-wrapper col-span-full flex flex-col gap-8">
		<hgroup>
			<h1 style="--wght: 500;">{project?.title}</h1>
			<p class="text-balance font-mono italic text-primary">{@html subtitle}</p>
		</hgroup>
		{#if project.tags?.length}
			<Marqueeck
				extend={false}
				--marqueeck-padding-y="0px"
				--marqueeck-bg-color="transparent"
				options={{ gap: 12, direction: 'left', speed: 20 }}
			>
				{#each project.tags as tag}
					<Badge variant="secondary" class="pointer-events-none">{tag.tags_id.title}</Badge>
				{/each}
			</Marqueeck>
		{/if}
	</div>
	{#if project.description}
		<div class="block-wrapper !col-auto">{@html description}</div>
	{/if}
	{#if project.site_url}
		<div class="block-wrapper z-40 col-start-3 h-fit">
			<Button href={project.site_url} size={'lg'} target="_blank" class=" w-full shadow-md">
				Voir le site
				<ExternalLink class="ml-1 size-4" />
			</Button>
		</div>
	{/if}
</Section>

{#if project.gallery?.length}
	<Gallery items={gallery}></Gallery>
{/if}

<Section content={{ width: 'full-width' }} class="z-50 pb-20">
	<p class="lead pb-8">
		Ce projet vous a plu ? Vous avez un projet similaire (ou pas) en tête ?
		<br />
		N'hésitez pas à me contacter !
	</p>
	<ContactMarquee />
</Section>

<style>
	:global(p + p) {
		margin-top: 0.65em;
	}
</style>
