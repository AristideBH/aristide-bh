<script lang="ts">
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';
	import Logo from '$lib/components/layout/Logo.svelte';
	import MenuButton from '$lib/components/layout/MenuButton.svelte';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SectionNudge from '$lib/components/layout/SectionNudge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { addClassesToParagraphs } from '$lib/logic/strings.js';
	import { clipPath } from '$lib/logic/transition';
	import Marqueeck, { type MarqueeckOptions } from '@arisbh/marqueeck';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { quartOut } from 'svelte/easing';

	let serviceSectionToggle = $state(false);

	const options: MarqueeckOptions = {
		gap: 46,
		hoverSpeed: 200
	};

	onMount(() => (serviceSectionToggle = true));

	let { data } = $props();
	let { home, categories } = data;
</script>

<MetaTags title={home!.seo_detail?.meta_title!} description={home!.seo_detail?.meta_description!} />

<Section class="z-50 scroll-mt-96 from-0% pt-10" content={{ width: 'full-width' }} id="home_header">
	<AnimatedHeading class="mb-0 flex flex-wrap items-baseline ~text-6xl/9xl ~gap-4/8">
		<MenuButton class="grid aspect-logo -translate-y-[0.025em] ~text-6xl/9xl">
			<Button role="status" variant="white" class="group aspect-logo h-full w-full cursor-default">
				<Logo class="transition-colors !~size-12/20 group-hover:fill-white" />
			</Button>
		</MenuButton>

		{data.global.project_name}
	</AnimatedHeading>

	<p class="lead font-mono italic text-primary">{data.global.project_descriptor}</p>
</Section>

<Section content={{ width: 'full-width' }} class="-my-16 min-h-[430px] scroll-mt-96" id="services">
	{#if serviceSectionToggle && categories}
		<div
			class="layout-full flex flex-col items-center gap-4 overflow-x-visible py-16"
			transition:clipPath={{ direction: 'LEFT', duration: 400, easing: quartOut }}
		>
			{#each categories as category}
				<Marqueeck options={{ ...options, speed: category.speed! }} class=" -rotate-3">
					{#if category.tags}
						{#each category.tags as tag}
							<span>{tag.title}</span>
						{/each}
					{/if}
				</Marqueeck>
			{/each}
		</div>
	{/if}
</Section>

<Section content={{ template: 'inherit-main' }} class="scroll-mt-96 !p-0" id="about">
	{#if home?.presentation}
		<div class="block-wrapper flex flex-col gap-4">
			{@html addClassesToParagraphs(home.presentation, 'lead text-balance')}
		</div>
	{/if}
	{#if home?.img}
		<Image
			item={home.img}
			class="block-wrapper col-start-3 -col-end-1 me-auto h-fit max-w-80"
			loading="eager"
		/>
	{/if}
</Section>

<Section id="projects" class="scroll-mt-96">
	{#if home?.nudge_project}
		<SectionNudge>{home.nudge_project}!</SectionNudge>
	{/if}

	{#if home?.pinned_projects}
		<div class=" grid grid-cols-1 gap-4">
			{#each home?.pinned_projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}

	<Button variant="secondary" size="lg" class="mx-auto mt-6 w-fit" href="/projets">Voir plus</Button
	>
</Section>

<Section content={{ width: 'full-width' }} class="pb-24" id="contact">
	{#if home?.contact_text}
		{@html addClassesToParagraphs(home?.contact_text, 'lead mb-8 text-balance')}
	{/if}

	{#if home?.contact_nudge}
		<SectionNudge>{home.contact_nudge}</SectionNudge>
	{/if}

	<ContactMarquee />
</Section>

<style lang="postcss">
	:global(:root) {
		--marqueeck-bg-color: hsl(var(--foreground));
		--marqueeck-text-color: hsl(var(--background));
		--marqueeck-padding-y: 0.75rem;
	}

	:global(section.layout-full [role='marqueeck']) {
		grid-column: full;
	}

	span {
		@apply select-none font-heading ~text-3xl/5xl;
	}
</style>
