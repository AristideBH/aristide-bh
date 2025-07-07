<script lang="ts">
	import type { CustomDirectusFile, DirectusClient } from '$lib/logic/directus';
	import type { Types } from '$lib/types/client';
	type Props = {
		item: CustomDirectusFile | Types.Optional<string>;
		class?: string;
		style?: string;
	};

	import { getContext, onMount } from 'svelte';
	import { getFileInfos, getVideoUrl } from '.';
	import { browser } from '$app/environment';
	let Plyr: any;
	let player: any;

	import '../../style/plyr.css';

	onMount(async () => {
		if (browser) {
			const module = await import('plyr');
			Plyr = module.default;
			player = new Plyr('.js-player', {
				controls: ['play-large'],
				autopause: true,
				resetOnEnd: true
			});
		}
	});

	let { item, class: className, style }: Props = $props();
	const directus = getContext<DirectusClient>('directus');
	let id = typeof item === 'string' ? item : item?.id;
	let fetchedFile = $state<CustomDirectusFile>({});
	let url = $derived(getVideoUrl(id!));

	$effect(() => {
		if (typeof id === 'string') {
			getFileInfos(directus, id).then((data) => {
				fetchedFile = data;
			});
		} else {
			fetchedFile = item as CustomDirectusFile; // Else, just use the item
		}
	});
</script>

<div class="video rounded {className ?? ''}" {style}>
	<video playsinline controls muted class="js-player cursor-pointer object-cover">
		<source src={url} type="video/mp4" />
	</video>
</div>

<style>
	:global(:root) {
		--plyr-color-main: hsl(var(--primary));
		--plyr-control-spacing: 24px;
	}
	:global(.plyr--video .plyr__control:hover) {
		--plyr-control-spacing: 28px;
	}
</style>
