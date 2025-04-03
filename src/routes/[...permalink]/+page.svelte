<script lang="ts">
	import Builder from '$lib/components/editor/Builder.svelte';
	let { data } = $props();
	let { page, editor } = data;
</script>

<Builder nodes={editor} />
