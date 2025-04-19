<script lang="ts">
	import Builder from '$lib/components/editor/Builder.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	let { data } = $props();
	let { page, editor } = data;
</script>

<pre>{JSON.stringify(page.seo, null, 2)}</pre>

<MetaTags
	title={page?.seo.title ?? 'Projet'}
	description={page?.seo.meta_description ?? ''}
	titleTemplate="%s | Aristide BH"
/>

<Builder nodes={editor} />
