<script lang="ts">
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import Marqueeck, { type MarqueeckOptions } from '@arisbh/marqueeck';
	import { ChevronsDown } from 'lucide-svelte';

	const options: MarqueeckOptions = {
		gap: 46
	};

	// import Seo from '@archangelgca/sk-seo';

	let { data } = $props();
	let { home } = data;
</script>

<!-- <Seo title={home!.seo_detail?.meta_title!} description={home!.seo_detail?.meta_description!} /> -->

<Section>
	<AnimatedHeading class="mb-0 ~text-6xl/9xl">{data.global.project_name}</AnimatedHeading>
	<p class="lead italic text-primary">{data.global.project_descriptor}</p>
</Section>

<Section content={{ width: 'full-width', color: 'none' }} class="pt-0">
	<Marqueeck options={{ ...options, speed: 50 }} class="layout-full -rotate-3">
		<span>Direction artistique</span>
		<span>Conception de logos</span>
		<span>Web design</span>
		<span>Charte graphique</span>
		<span>Illustrations</span>
		<span>Motion Design</span>
		<span>Édition papier</span>
		<span>Conseil éditorial</span>
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

<Section content={{ color: 'none', template: 'inherit-main' }} class="!p-0">
	<div class="block-wrapper flex flex-col gap-4">
		<p class="text-balance leading-relaxed">
			Fort d'un Master en Communication Visuelle décerné par ECV Paris, et par la variété des
			secteurs que j'ai pu approcher (culture, agro-alimentaire, banque, santé...), j'ai acquis avec
			le temps et la pratique, l'expérience nécessaire pour répondre à toutes types de demandes.
		</p>
		<p class="text-balance leading-relaxed">
			Concencieux, rigoureux et à l'écoute, je veille à toujours proposer les solutions les plus
			pertinentes pour répondre à vos besoins.
		</p>
		<p class="items-cente inline-flex gap-1 pt-6 text-sm italic text-primary">
			<span class="">
				<ChevronsDown class="size-5" />
			</span>
			Retrouvez quelques uns de mes projets ci-dessous !
		</p>
	</div>

	<Image item={home?.img!} class="block-wrapper col-start-3 -col-end-1" loading="lazy" />
</Section>

<Section>
	<p
		class="text-balance rounded border-2 border-dashed border-muted p-6 text-center text-xl text-secondary"
	>
		En cours de construction, revenez plus tard !
	</p>
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
		@apply font-heading text-4xl;
	}
</style>
