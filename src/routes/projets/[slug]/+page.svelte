<script lang="ts">
	import Image from '$lib/components/image/Image.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Section from '$lib/components/layout/Section.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { project } = data;
</script>

<!-- <pre>{JSON.stringify(data.project, null, 2)}</pre> -->
<Header />
<Section>
	<h1>{project?.title}</h1>
	<h2>{project?.subtitle}</h2>
</Section>

<Section>
	<Image item={project?.thumbnail!} />
</Section>
