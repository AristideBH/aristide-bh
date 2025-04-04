<script lang="ts">
	import { ChevronsDown } from 'lucide-svelte';
	import Marqueeck from '@arisbh/marqueeck';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from '../$types';
	import Logo from '$lib/components/layout/Logo.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { handleContact } from '$lib/logic/email';
	import SectionNudge from '$lib/components/layout/SectionNudge.svelte';
	import ContactMarquee from '$lib/components/layout/ContactMarquee.svelte';

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

<MetaTags
	title="Aristide BH | Maintenance"
	description={global.maintenance_title! + ' ' + global.maintenance_description}
/>

<Section content={{ width: 'full-width' }} class=" !mb-0 !mt-56 gap-y-4 !p-0">
	<Marqueeck
		options={{ gap: 75, speed: 35, direction: 'left' }}
		class="layout-full -rotate-3 font-heading transition-colors"
		ribbonClasses="text-background"
		--marqueeck-padding-y="1.5rem"
		--marqueeck-bg-color="hsl(var(--foreground))"
	>
		<svelte:fragment slot="separator">
			<Logo class="w-20 fill-background" />
		</svelte:fragment>

		<span class="select-none font-heading ~text-3xl/5xl"
			>{global.maintenance_title ?? 'En maintenance'}</span
		>
	</Marqueeck>
</Section>

<Section class="mt-0">
	<div class="mt-8 max-w-[37ch] text-2xl leading-10 text-foreground/75 md:text-3xl">
		<div class="leading-10">{global.maintenance_description}</div>
	</div>
</Section>

<Section
	content={{ width: 'full-width' }}
	class="layout-full content-grid mt-18 !mb-32 gap-y-4 !p-0"
>
	<SectionNudge>En attendant, laissez moi un mail :</SectionNudge>
	<ContactMarquee />
</Section>
