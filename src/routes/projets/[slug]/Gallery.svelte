<script lang="ts">
	import MediaDiscriminator from '$lib/components/image/MediaDiscriminator.svelte';
	import type { CustomDirectusFile } from '$lib/logic/directus';
	import { scrollY, innerWidth } from 'svelte/reactivity/window';
	import { onDestroy, onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { lowestFraction } from '$lib/logic/utils';

	let { items }: { items: CustomDirectusFile[] } = $props();
	let horizontalSection = $state<HTMLElement | null>(null);
	let elementWrapper: HTMLDivElement | null = null;
	let horLength = $state(0);
	let distFromTop = $state(0);
	let scrollDistance = $state(0);

	const refreshGallery = () => {
		if (!browser) return;
		if (elementWrapper) horLength = elementWrapper.scrollWidth;
		if (horizontalSection) distFromTop = horizontalSection.offsetTop;
	};

	onMount(async () => {
		window.addEventListener('resize', refreshGallery);
		await tick();
		refreshGallery();
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('resize', refreshGallery);
	});

	function scrollHandler() {
		let scrollTop = scrollY.current;
		if (!scrollTop || !elementWrapper) return;
		if (scrollTop >= distFromTop && scrollTop <= scrollDistance) {
			elementWrapper.style.transform = `translateX(-${scrollTop - distFromTop}px)`;
		}
	}

	$effect(() => {
		scrollDistance = distFromTop + horLength - (innerWidth.current ?? 0);
		if (horizontalSection) horizontalSection.style.height = `${horLength}px`;
	});
</script>

<svelte:window onscroll={scrollHandler} onresize={refreshGallery} />

<section class="layout-full !block" bind:this={horizontalSection} style:height={`${horLength}px`}>
	<div class="sticky top-20 w-full overflow-hidden">
		<div class="element-wrapper relative flex gap-8" bind:this={elementWrapper}>
			{#each items as item}
				{#if item}
					{@const ratio = lowestFraction(item.width ?? 9, item.height ?? 16)}
					<div
						class="h-[75dvh] max-h-[1000px] min-h-[500px] shrink-0 rounded shadow-lg"
						style:aspect-ratio={ratio}
					>
						<MediaDiscriminator {item} />
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>
