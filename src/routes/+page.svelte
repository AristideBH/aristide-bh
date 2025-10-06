<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';
	import Logo from '$lib/components/layout/Logo.svelte';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import ProjectsMarquee from '$lib/components/layout/ProjectsMarquee.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SectionNudge from '$lib/components/layout/SectionNudge.svelte';
	import { addClassesToParagraphs, formatText, frenchTypoRules } from '$lib/logic/strings.js';
	import { clipPath } from '$lib/logic/transition';
	import Marqueeck, { type MarqueeckOptions } from '@arisbh/marqueeck';
	import { onMount } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import { dirhover } from '@arisbh/dirhover-svelte';

	let serviceSectionToggle = $state(false);

	const options: MarqueeckOptions = {
		gap: 46,
		hoverSpeed: 150,
		childStaggerDuration: 1000,
		childStagger: true
	};

	let { data } = $props();
	let { home, categories, wall_projects_pools } = data;
	let aboutText = $state('');
	let contactText = $state('');
	let loading = $state(true);

	if (browser) {
		onMount(() => {
			serviceSectionToggle = true;
			loading = false;
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
	class="z-40 scroll-mt-32 from-0% !pb-0 pt-10 transition-opacity duration-500
			{loading ? 'opacity-0' : 'opacity-100'} "
	content={{ width: 'full-width' }}
	id="home_header"
>
	<!-- content here -->
	<AnimatedHeading class="mb-0 flex flex-wrap items-baseline ~gap-4/8">
		<Logo
			padding={true}
			{@attach dirhover({
				childClass:
					'!~size-12/20 ~text-6xl/9xl flex item-center justify-center  group-hover:fill-white',
				curtainClass: '!bg-primary'
			})}
			class="group select-none bg-white transition-colors"
		/>

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
				<Marqueeck options={{ ...options, speed: category.speed! }} class="-rotate-3">
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
			<div class="mt-6 flex items-baseline gap-3">
				<p class="text-secondary-foreground/70">Pour un peu plus d'infos :</p>
				{#each page.data.footerNav.items as item}
					<a
						href={item.url}
						class="animate text-lg text-foreground hover:no-underline"
						target="_blank">{item.label}</a
					>
				{/each}
			</div>
		</div>
	{/if}
	{#if home?.img}
		<Image
			item={home.img}
			class="block-wrapper col-start-3 -col-end-1 h-fit max-w-64 shadow-lg lg:mx-0 lg:max-w-none"
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
</Section>

<!-- * Projects Wall -->
<ProjectsMarquee pools={wall_projects_pools} />

<!-- * Contact -->
<Section content={{ width: 'full-width' }} class="-mt-8 pb-24" id="contact">
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
