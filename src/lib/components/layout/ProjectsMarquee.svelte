<script lang="ts">
	import type { CustomDirectusFile } from '$lib/logic/directus';
	import { clipPath } from '$lib/logic/transition';
	import Marqueeck from '@arisbh/marqueeck';
	import Section from './Section.svelte';
	import { lowestFraction } from '$lib/logic/utils';
	import { quartOut } from 'svelte/easing';
	import Image from '$lib/components/image/Image.svelte';

	let {
		pools
	}: {
		pools: CustomDirectusFile[][] | undefined;
	} = $props();
</script>

{#if pools}
	<Section content={{ width: 'full-width' }} class="-mt-16 scroll-mt-32" id="projects_wall">
		<div
			class="layout-full flex flex-col items-center gap-3 overflow-x-visible"
			transition:clipPath={{ direction: 'LEFT', duration: 400, easing: quartOut }}
		>
			{#each pools ?? [] as pool, i}
				<Marqueeck
					options={{
						speed: 45 * (i + 0.5),
						gap: 12,
						brakeDuration: 1000,
						hoverSpeed: 20,
						childStagger: true,
						childStaggerDuration: 1000
					}}
					class="-rotate-3"
					--marqueeck-padding-y="0px"
					--marqueeck-bg-color="transparent"
				>
					{#each pool as item}
						{#if item}
							{@const ratio = lowestFraction(item.width ?? 16, item.height ?? 9)}
							<Image
								{item}
								loading="lazy"
								preset="320"
								class="max-h-36 [&>img]:shadow-lg"
								style="aspect-ratio: {ratio}"
							/>
						{/if}
					{/each}
				</Marqueeck>
			{/each}
		</div>
	</Section>
{/if}
