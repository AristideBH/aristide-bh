<script lang="ts">
	import MediaDiscriminator from '$lib/components/image/MediaDiscriminator.svelte';
	import type { CustomDirectusFile, DirectusClient } from '$lib/logic/directus';
	import { scrollY, innerWidth } from 'svelte/reactivity/window';
	import { getFileInfos } from '$lib/components/image';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { items }: { items: CustomDirectusFile[] } = $props();
	const directus = getContext<DirectusClient>('directus');

	const objs = items.map(async (item) => {
		return getFileInfos(directus, item?.directus_files_id);
	});

	let horizontalSection = $state<HTMLElement | null>(null);
	let elementWrapper: HTMLDivElement | null = null;
	let horLength = $state(0);
	let distFromTop = $state(0);
	let scrollDistance = $state(0);

	const refresh = () => {
		if (!browser) return;
		if (elementWrapper) {
			horLength = elementWrapper.scrollWidth;
		}
		if (horizontalSection) {
			distFromTop = horizontalSection.offsetTop;
		}
	};

	const lowestFraction = (a: number, b: number): string => {
		const gcd = (x: number, y: number): number => {
			x = Math.abs(x);
			y = Math.abs(y);
			return y === 0 ? x : gcd(y, x % y);
		};
		const divisor = gcd(a, b);
		return `${a / divisor}/${b / divisor}`;
	};

	onMount(() => {
		refresh();
		window.addEventListener('resize', refresh);
		setTimeout(() => {
			refresh();
		}, 500);
	});

	onDestroy(() => window.removeEventListener('resize', refresh));

	function scrollHandler() {
		let scrollTop = scrollY.current;
		if (!scrollTop || !elementWrapper) return;
		if (scrollTop >= distFromTop && scrollTop <= scrollDistance) {
			elementWrapper.style.transform = `translateX(-${scrollTop - distFromTop}px)`;
		}
	}

	$effect(() => {
		scrollDistance = distFromTop + horLength - (innerWidth.current ?? 0);
		if (horizontalSection) {
			horizontalSection.style.height = `${horLength}px`;
		}
	});
</script>

<svelte:window onscroll={scrollHandler} onresize={refresh} />

<section class="layout-full !block" bind:this={horizontalSection} style:height={`${horLength}px`}>
	<div class="sticky top-28 w-full overflow-hidden">
		<div class="element-wrapper relative flex gap-8" bind:this={elementWrapper}>
			{#each objs as obj}
				{#await obj then item}
					{@const ratio = lowestFraction(item.width ?? 16, item.height ?? 9)}
					<div
						class="h-[75dvh] max-h-[1000px] min-h-[500px] shrink-0 rounded shadow-lg"
						style:aspect-ratio={ratio}
					>
						<MediaDiscriminator {item} />
					</div>
				{/await}
			{/each}
		</div>
	</div>
</section>
