<script lang="ts">
	import { ChevronsDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<p class="mt-0 flex items-start gap-2 text-balance pb-4 font-mono text-sm italic text-primary">
	<ChevronsDown class="size-5" />
	{@render children()}
</p>
