<script lang="ts">
	import Builder from '$lib/components/editor/Builder.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	let { data } = $props();
	let { page, editor } = data;
</script>

<MetaTags
	title={page?.seo.title}
	description={page?.seo.meta_description}
	titleTemplate="%s | Aristide BH"
/>

<Builder nodes={editor} />
