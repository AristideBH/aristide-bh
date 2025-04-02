<script lang="ts">
	import { ArrowDown, ChevronsDown } from 'lucide-svelte';
	import Marqueeck from '@arisbh/marqueeck';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from '../$types';
	import Logo from '$lib/components/layout/Logo.svelte';
	import Section from '$lib/components/layout/Section.svelte';

	const mail = 'aristide.bruneau@gmail.com';
	const handleContact = () => {
		const mailSubject = '[> aristide-bh.com]';
		var mailBody = 'Bonjour Aristide,\n';
		const emailLink = document.createElement('a');
		emailLink.setAttribute('target', '_blank');
		emailLink.setAttribute(
			'href',
			`mailto:${mail}?Subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`
		);
		emailLink.click();
	};

	onMount(() => {
		if (!browser) return;
		document.body.classList.add('maintenance-page');
	});

	export let data: PageData;
	$: ({ global } = data);
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Section content={{ width: 'full-width' }} class=" !mb-0 !mt-56 gap-y-4 !p-0">
	<Marqueeck
		options={{ gap: 75, speed: 35, direction: 'left' }}
		class="layout-full -rotate-3 bg-foreground font-heading transition-colors"
		ribbonClasses="text-background"
		--marqueeck-padding-y="1.5rem"
	>
		<svelte:fragment slot="separator">
			<Logo class="w-20 fill-background" />
		</svelte:fragment>

		<span class="sectorTitle text-7xl">{global.maintenance_title ?? 'En maintenance'}</span>
	</Marqueeck>
</Section>

<Section class="mt-0">
	<div class="mt-8 max-w-[37ch] text-balance text-3xl leading-10 text-foreground/75 md:text-4xl">
		<div class="leading-10">{global.maintenance_description}</div>
	</div>
</Section>

<Section
	content={{ width: 'full-width' }}
	class="layout-full content-grid mt-18 !mb-32 gap-y-4  !p-0"
>
	<p class="small inline-flex items-center gap-1 italic text-primary">
		<ChevronsDown class="size-5" />
		En attendant, laissez moi un email :
	</p>
	<Marqueeck
		options={{ speed: 43, direction: 'left', gap: 56 }}
		class="layout-full -rotate-3 "
		--marqueeck-padding-y="1.5rem"
		--marqueeck-bg-color="hsl(var(--primary))"
	>
		<a class="font-heading text-6xl font-semibold text-background" href="mailto:{mail}">{mail}</a>
	</Marqueeck>
</Section>
