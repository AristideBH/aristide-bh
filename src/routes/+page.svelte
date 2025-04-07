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
	let { home, projects } = data;
</script>

<MetaTags title={home!.seo_detail?.meta_title!} description={home!.seo_detail?.meta_description!} />

<Section class="z-50 scroll-mt-96 from-0% pt-10" content={{ width: 'full-width' }} id="home_header">
	<AnimatedHeading class="mb-0 flex flex-wrap items-baseline ~text-6xl/9xl ~gap-4/8">
		<MenuButton class="grid aspect-logo -translate-y-[0.025em] ~text-6xl/9xl">
			<Button role="status" variant="white" class="group aspect-logo h-full w-full cursor-default">
				<Logo class="transition-colors !~size-10/20 group-hover:fill-white" />
			</Button>
		</MenuButton>

		{data.global.project_name}
	</AnimatedHeading>

	<p class="lead font-mono italic text-primary">{data.global.project_descriptor}</p>
</Section>

<Section content={{ width: 'full-width' }} class=" -my-16 min-h-[430px] scroll-mt-96" id="services">
	{#if serviceSectionToggle}
		<div
			class="layout-full flex flex-col items-center gap-4 overflow-x-visible py-16"
			transition:clipPath={{ direction: 'LEFT', duration: 400, easing: quartOut }}
		>
			<Marqueeck options={{ ...options, speed: 50 }} class=" -rotate-3">
				<span>Direction artistique</span>
				<span>Conception de logos</span>
				<span>Web design</span>
				<span>Charte graphique</span>
				<span>Illustrations</span>
				<span>Motion Design</span>
				<span>Édition papier</span>
				<span>Conseil éditorial</span>
				<span>UI/UX</span>
			</Marqueeck>
			<Marqueeck options={{ ...options, speed: 57 }} class=" -rotate-3">
				<span>Intégration Frontend</span>
				<span>Dévelopement Backend</span>
				<span>Wordpress</span>
				<span>Javascript/Typescript</span>
				<span>SvelteKit</span>
				<span>CSS/Tailwind</span>
				<span>SEO</span>
				<span>Web application</span>
			</Marqueeck>
			<Marqueeck options={{ ...options, speed: 43 }} class=" -rotate-3">
				<span>Modélisation</span>
				<span>Impression 3D</span>
				<span>PLV/Merchandising</span>
				<span>Conception produits</span>
				<span>Plans/rendus 3D</span>
				<span>Menuiserie</span>
			</Marqueeck>
		</div>
	{/if}
</Section>

<Section content={{ template: 'inherit-main' }} class="scroll-mt-96 !p-0" id="about">
	<div class="block-wrapper flex flex-col gap-4">
		<p class="lead">
			Après 7 ans en agence pluri-disciplinaire, je fais preuve d'une solide expérience dans la
			création et la gestion de projets dans de nombreux secteurs d'activités (culturel, bancaire,
			santé, agro-alimentaire...) et sous toutes ses coutures&NonBreakingSpace;: conseil,
			conception, création, développement, déploiement et suivi.
		</p>
		<p class="lead mb-8 border-s-2 border-primary ps-5">
			Concencieux, rigoureux et à l'écoute, je veille à toujours cerner les solutions les plus
			pertinentes pour répondre à vos besoins, et vous propose mes services en tant que freelance
			indépendant.
		</p>
	</div>

	<Image
		item={home?.img!}
		class="block-wrapper col-start-3 -col-end-1 me-auto h-fit max-w-80"
		loading="lazy"
	/>
</Section>

<Section id="projects" class="scroll-mt-96">
	<SectionNudge>Retrouvez quelques uns de mes projets ci-dessous !</SectionNudge>

	{#if projects}
		<div class=" grid grid-cols-1 gap-4">
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}

	<Button variant="secondary" size="lg" class="mx-auto mt-6 w-fit" href="/projets">Voir plus</Button
	>
</Section>

<Section content={{ width: 'full-width' }} class="pb-24" id="contact">
	<p class="lead text-balance pb-8">
		Si vous aimez ce que vous voyez, que ma démarche vous parle ou que vous avez un projet en tête,
		n'hésitez pas à me contacter !
	</p>

	<SectionNudge>Laissez moi un message !</SectionNudge>

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
