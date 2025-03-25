<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import * as Card from '$lib/components/ui/card';
	import Section from '$lib/components/layout/Section.svelte';
	import AnimatedHeading from '$lib/components/editor/components/AnimatedHeading.svelte';
</script>

<svelte:head>
	<title>{data.global.project_name} | Maintenance</title>
</svelte:head>

<Section>
	<AnimatedHeading class="mb-0 ~text-6xl/9xl">{data.global.project_name}</AnimatedHeading>
	<p class="lead mb-10 italic text-primary">{data.global.project_descriptor}</p>
</Section>

<Section content={{ template: 'inherit-main' }}>
	<Card.Root class="bg-muted">
		<Card.Header class="border-b border-secondary pb-6">
			<h2>{data.maintenance.title}</h2>
			<Card.Description>{data.maintenance.description}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				En attendant, vous pouvez me contacter
				<a class="underline hover:decoration-primary" href="mailto:aristide.bruneau@gmail.com">
					par mail
				</a>.
			</p>
			<!-- <ul>
				<li></li>
				<li><a target="_blank" href="https://x.com/Tydilicious">Par Twitter</a></li>
				<li><a target="_blank" href="https://x.com/Tydilicious">Twitter</a></li>
			</ul> -->
		</Card.Content>
	</Card.Root>
</Section>

<style lang="postcss">
	a {
		@apply text-white;
	}
</style>
