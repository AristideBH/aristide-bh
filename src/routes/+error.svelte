<script lang="ts">
	import { page } from '$app/state';
	import Marqueeck from '@arisbh/marqueeck';
	import Section from '$lib/components/layout/Section.svelte';
	import { dirhover } from '@arisbh/dirhover-svelte';

	const status = structuredClone(page.status);
	const error = structuredClone(page.error);

	const message = [
		{ text: `${status}`, gap: 65, class: 'text-8xl pt-6 pb-4 mb-2' },
		{ text: "Une erreur s'est produite", gap: 20, class: 'text-lg py-2' }
	];
	
	const errorChars = $derived(status?.toString().split('') || []);
</script>

<section class="flex flex-row gap-1">

	{#each errorChars as char}
		<span class="~size-36/72 text-9xl font-light font-heading bg-foreground text-background transition-colors duration-150 hover:text-foreground" 
	{@attach dirhover({
				childClass:
					'!~size-36/72 grid place-items-center group-hover:fill-white',
				curtainClass: '!bg-primary'
			})}>
		{char}
	</span>
	{/each}
</section>

<!-- <Section content={{ width: 'full-width' }} class="full-width flex flex-col">
	{#each message as _, i}
		<Marqueeck
			class="{_.class} layout-full -rotate-3 bg-muted font-heading text-foreground"
			options={{ speed: 5 * (i + 10), gap: _.gap }}
		>
			{_.text}
		</Marqueeck>
	{/each}
</Section> -->

<section class="flex flex-col">
	<!-- <pre>{JSON.stringify(error, null, 2)}</pre> -->
	<p class="lead text-balance">
		Cette page semble ne pas exister !<br /> Reprenez depuis la <a href="/"> page d'accueil</a>.
	</p>

	
</section>

