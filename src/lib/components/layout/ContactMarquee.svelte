<script lang="ts">
	import { handleContact } from '$lib/logic/email';
	import { clipPath } from '$lib/logic/transition';
	import Marqueeck from '@arisbh/marqueeck';

	const mail = 'hello@aristide-bh.com';
	let hovered = $state(false);
</script>

{#if hovered}
	<span
		in:clipPath={{ direction: 'LEFT', duration: 750 }}
		out:clipPath={{ direction: 'RIGHT', duration: 750 }}
		class="layout-full fixed inset-0 z-[-1] h-full w-full bg-primary/20"
	>
	</span>
{/if}

<Marqueeck
	options={{ speed: 43, direction: 'left', gap: 56 }}
	class="layout-full z-50 -rotate-3 transition-all"
	--marqueeck-padding-y="1.5rem"
	--marqueeck-bg-color="hsl(var(--primary))"
	onClick={() => handleContact(mail)}
	hoverClasses="bg-foreground drop-shadow-glow"
>
	<span class="font-heading font-semibold text-background ~text-4xl/6xl">
		{mail}
	</span>
</Marqueeck>
