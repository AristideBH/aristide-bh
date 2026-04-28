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
</script>

<section class="flex flex-row">
	<span class="~size-12/20" 
	{@attach dirhover({
				childClass:
					'!~size-12/20 grid place-items-center group-hover:fill-white',
				curtainClass: '!bg-primary'
			})}>
		4
	</span>
	<span class="~size-12/20" 
	{@attach dirhover({
				childClass:
					'!~size-12/20 grid place-items-center group-hover:fill-white',
				curtainClass: '!bg-primary'
			})}>
		0
	</span>
	<span class="~size-12/20" 
	{@attach dirhover({
				childClass:
					'!~size-12/20 grid place-items-center group-hover:fill-white',
				curtainClass: '!bg-primary'
			})}>
		4
	</span>
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

