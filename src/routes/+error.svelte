<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftFromLine } from 'lucide-svelte';
	import Marqueeck from '@arisbh/marqueeck';
	import Section from '$lib/components/layout/Section.svelte';

	const status = structuredClone(page.status);
	const error = structuredClone(page.error);

	const message = [
		{ text: `${status}`, gap: 65, class: 'text-8xl pt-6 pb-4 mb-2' },
		{ text: "Une erreur s'est produite", gap: 20, class: 'text-lg py-2' }
	];
</script>

<Section content={{ width: 'full-width' }} class="full-width flex flex-col">
	{#each message as _, i}
		<Marqueeck
			class="{_.class} layout-full -rotate-3 bg-muted font-heading text-foreground"
			options={{ speed: 5 * (i + 10), gap: _.gap }}
		>
			{_.text}
		</Marqueeck>
	{/each}
</Section>

<section class="flex flex-col">
	<!-- <pre>{JSON.stringify(error, null, 2)}</pre> -->
	<p class="lead text-balance">
		Cette page semble ne pas exister !<br /> Reprenez depuis la <a href="/"> page d'accueil</a>.
	</p>
</section>

<!-- <section>
	<Card.Root class="bg-muted">
		<Card.Header>
			<h1>Oops !</h1>
			<Card.Description>Erreur {status} : {error?.message}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>Seems like the page you are looking doesn't exist !</p>
		</Card.Content>
		<Card.Footer class="flex gap-2">
			<Button
				variant="border"
				size="icon"
				title="Page précédente"
				onclick={() => {
					window.history.back();
					return false;
				}}
			>
				<ArrowLeftFromLine class="size-4" />
			</Button>
			<Button variant="default" href="/">Go back home</Button>
		</Card.Footer>
	</Card.Root>
</section> -->
