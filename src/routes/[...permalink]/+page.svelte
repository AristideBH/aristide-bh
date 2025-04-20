<script lang="ts">
	import Builder from '$lib/components/editor/Builder.svelte';
	let { data } = $props();
	let { page, editor } = data;
</script>

<pre>{JSON.stringify(page.seo, null, 2)}</pre>

<svelte:head>
	<title>{page?.seo.title}</title>
	<meta name="description" content={page?.seo.meta_description} />
</svelte:head>

<Builder nodes={editor} />
