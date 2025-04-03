<script lang="ts">
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import Marqueeck, { type MarqueeckOptions } from '@arisbh/marqueeck';
	import { ChevronsDown } from 'lucide-svelte';
	import Logo from '$lib/components/layout/Logo.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import { handleContact } from '$lib/logic/email';
	import { goto, preloadData, pushState } from '$app/navigation';
	import Project from './projets/[slug]/+page.svelte';
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const mail = 'aristide.bruneau@gmail.com';
	let modalState = $state(false);

	const options: MarqueeckOptions = {
		gap: 46,
		hoverSpeed: 200
	};

	let { data } = $props();
	let { home, projects } = data;

	async function showModal(e: MouseEvent): Promise<void> {
		e.preventDefault();
		const { href } = e.currentTarget as HTMLAnchorElement;
		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { selected: result.data, shallow: true });
			modalState = true;
		} else {
			goto(href);
		}
	}

	const closeModal = () => {
		history.back();
		modalState = false;
	};
</script>

<MetaTags title={home!.seo_detail?.meta_title!} description={home!.seo_detail?.meta_description!} />

<Section class="z-50 scroll-mt-96 from-0% pt-10" content={{ width: 'full-width' }} id="home_header">
	<AnimatedHeading class="mb-0 flex flex-wrap items-baseline gap-[0.35ch] ~text-6xl/9xl">
		<Logo class="h-[0.635em] fill-primary" />
		{data.global.project_name}
	</AnimatedHeading>
	<p class="lead italic text-primary">{data.global.project_descriptor}</p>
</Section>

<Section content={{ width: 'full-width' }} class=" scroll-mt-96 pt-0" id="services">
	<Marqueeck options={{ ...options, speed: 50 }} class="layout-full -rotate-3">
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
	<Marqueeck options={{ ...options, speed: 57 }} class="layout-full -rotate-3">
		<span>Intégration Frontend</span>
		<span>Dévelopement Backend</span>
		<span>Wordpress</span>
		<span>Javascript/Typescript</span>
		<span>SvelteKit</span>
		<span>CSS/Tailwind</span>
		<span>SEO</span>
		<span>Web application</span>
	</Marqueeck>
	<Marqueeck options={{ ...options, speed: 43 }} class="layout-full -rotate-3">
		<span>Modélisation</span>
		<span>Impression 3D</span>
		<span>PLV/Merchandising</span>
		<span>Conception produits</span>
		<span>Plans/rendus 3D</span>
		<span>Menuiserie</span>
	</Marqueeck>
</Section>

<Section content={{ template: 'inherit-main' }} class="scroll-mt-96 !p-0" id="about">
	<div class="block-wrapper flex flex-col gap-4">
		<p class="lead text-pretty leading-relaxed">
			Après 7 ans en agence pluri-disciplinaire, je fais preuve d'une solide expérience dans la
			création et la gestion de projets dans de nombreux secteurs d'activités (culturel, bancaire,
			santé, agro-alimentaire...) et sous toutes ses coutures&NonBreakingSpace;: conseil,
			conception, création, développement, déploiement et suivi.
		</p>
		<p class="lead text-pretty leading-relaxed">
			Concencieux, rigoureux et à l'écoute, je veille à toujours cerner les solutions les plus
			pertinentes pour répondre à vos besoins, et vous propose mes services en tant que freelance
			indépendant.
		</p>
	</div>

	<Image
		item={home?.img!}
		class="block-wrapper col-start-3 -col-end-1 mx-auto max-w-96"
		loading="lazy"
	/>
</Section>

<Section id="projects" class="scroll-mt-96">
	<p class="mb-4 inline-flex items-center gap-1 text-sm italic text-primary">
		<ChevronsDown class="size-5" />
		Retrouvez quelques uns de mes projets ci-dessous !
	</p>

	{#if projects}
		<div class=" grid grid-cols-1 gap-4">
			{#each projects as project}
				<ProjectCard {project} onclick={showModal} />
			{/each}
		</div>
	{/if}

	<Button variant="outline" class="mx-auto mt-6 w-fit" href="/projets">Voir plus</Button>
</Section>

<Dialog.Root open={modalState} onOpenChange={closeModal}>
	<Dialog.Content
		preventScroll={true}
		class="mx-auto my-8 flex max-h-[calc(100dvh-8rem)] flex-col overflow-auto rounded p-4 pt-6"
		style="max-width: min(var(--content-max-width), calc(100vw - 4rem));"
	>
		{#if page.state.selected}
			<Project data={page.state.selected} />
		{/if}
	</Dialog.Content>
</Dialog.Root>

<Section content={{ width: 'full-width' }} class="pb-24" id="contact">
	<p class="lead leading-relaxed">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, doloribus magnam? Recusandae,
		soluta quo eaque sunt delectus aspernatur unde velit et ullam laborum magnam deserunt distinctio
		corrupti eius eligendi quis?
	</p>

	<p class="mt-0 inline-flex items-center gap-1 py-6 text-sm italic text-primary">
		<span class="">
			<ChevronsDown class="size-5" />
		</span>
		Un projet en tête ? Contactez-moi !
	</p>

	<Marqueeck
		options={{ ...options, speed: 43, direction: 'left', gap: 56 }}
		class="layout-full -rotate-3"
		--marqueeck-padding-y="1.5rem"
		--marqueeck-bg-color="hsl(var(--primary))"
		onClick={() => handleContact(mail)}
	>
		<span class="font-heading font-semibold text-background ~text-4xl/6xl">
			aristide.bruneau@gmail.com
		</span>
	</Marqueeck>
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
