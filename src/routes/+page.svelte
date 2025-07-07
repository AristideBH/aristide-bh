<script lang="ts">
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';
	import Logo from '$lib/components/layout/Logo.svelte';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SectionNudge from '$lib/components/layout/SectionNudge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { addClassesToParagraphs, formatText, frenchTypoRules } from '$lib/logic/strings.js';
	import { clipPath } from '$lib/logic/transition';
	import Marqueeck, { type MarqueeckOptions } from '@arisbh/marqueeck';
	import { onMount } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import DirHover from '$lib/components/layout/DirHover.svelte';
	import { ChevronRight, ChevronsRight } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let serviceSectionToggle = $state(false);

	const options: MarqueeckOptions = {
		gap: 46,
		hoverSpeed: 150,
		childStaggerDuration: 1000,
		childStagger: true
	};

	let { data } = $props();
	let { home, categories } = data;
	let aboutText = $state('');
	let contactText = $state('');

	onMount(() => (serviceSectionToggle = true));
	if (browser) {
		onMount(() => {
			const rawAbout = home?.presentation!;
			aboutText = formatText(rawAbout);
			const rawContact = home?.contact_text!;
			contactText = frenchTypoRules(addClassesToParagraphs(rawContact!, 'lead mb-8 text-balance'));
		});
	}
</script>

<svelte:head>
	<title>{home?.seo.title}</title>
	<meta name="description" content={home?.seo.meta_description} />
</svelte:head>

<!-- * Name -->
<Section
	class="z-50 scroll-mt-32 from-0% !pb-0 pt-10"
	content={{ width: 'full-width' }}
	id="home_header"
>
	<AnimatedHeading class="mb-0 flex flex-wrap items-baseline ~text-6xl/9xl ~gap-4/8">
		<DirHover class="group bg-white">
			<div class="z-50 grid aspect-logo place-items-center px-4">
				<Logo class="select-none transition-colors !~size-12/20 group-hover:fill-white" />
			</div>
		</DirHover>

		{data.global.project_name}
	</AnimatedHeading>

	<p class="lead font-mono italic text-primary">{data.global.project_descriptor}</p>
</Section>

<!-- * Services -->
<Section content={{ width: 'full-width' }} class="-my-16 min-h-[430px] scroll-mt-32" id="services">
	{#if serviceSectionToggle && categories}
		<div
			class="layout-full flex flex-col items-center gap-4 overflow-x-visible py-16"
			transition:clipPath={{ direction: 'LEFT', duration: 400, easing: quartOut }}
		>
			{#each categories as category}
				<Marqueeck options={{ ...options, speed: category.speed! }} class=" -rotate-3">
					{#if category.tags}
						{#each category.tags as tag}
							<span class="select-none font-heading ~text-3xl/5xl">{tag.title}</span>
						{/each}
					{/if}
				</Marqueeck>
			{/each}
		</div>
	{/if}
</Section>

<!-- * About -->
<Section content={{ template: 'inherit-main' }} class="scroll-mt-32 !p-0" id="about">
	{#if home?.presentation}
		<div class="block-wrapper flex flex-col gap-4">
			{@html aboutText}
		</div>
	{/if}
	{#if home?.img}
		<Image
			item={home.img}
			class="block-wrapper col-start-3 -col-end-1 me-auto h-fit max-w-80 shadow-lg"
			loading="lazy"
		/>
	{/if}
</Section>

<!-- * Projects -->
<Section id="projects" class="scroll-mt-32">
	{#if home?.nudge_project}
		<SectionNudge>{home.nudge_project}</SectionNudge>
	{/if}

	{#if home?.pinned_projects}
		<div class="grid auto-rows-1fr grid-cols-1 grid-rows-explicit-rows gap-4">
			{#each home?.pinned_projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}

	<!-- <Button class="mx-auto mt-6 w-full max-w-[16ch] px-0 shadow-lg" href="/projets">
		<Marqueeck
			hoverClasses="bg-secondary"
			options={{ gap: 28, speed: 24, hoverSpeed: 100, brakeDuration: 1000 }}
			extend={false}
			class="transition-colors"
			--marqueeck-bg-color="hsl(var(--muted))"
			--marqueeck-text-color="hsl(var(--foreground))"
			--marqueeck-padding-y="1rem"
		>
			<span class="text-md">En voir plus</span>
			<svelte:fragment slot="separator">
				<ChevronsRight />
			</svelte:fragment>
		</Marqueeck>
	</Button> -->
</Section>

<!-- * Contact -->
<Section content={{ width: 'full-width' }} class="pb-24" id="contact">
	{#if home?.contact_text}
		{@html contactText}
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
</style>
