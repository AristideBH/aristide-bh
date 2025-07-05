<script lang="ts">
	import type { CustomDirectusFile, DirectusClient } from '$lib/logic/directus';
	import type { Types } from '$lib/types/client';
	import { getContext } from 'svelte';
	import { getFileInfos } from '.';
	import Video from './Video.svelte';
	import Image from './Image.svelte';

	type Props = {
		item: CustomDirectusFile | Types.Optional<string>;
		topGap?: number;
	};

	let { item, topGap }: Props = $props();
	let id = typeof item === 'string' ? item : item?.id;
	let type = $state<string | undefined | null>('');
	const directus = getContext<DirectusClient>('directus');
	let classes = $state<string>('!sticky h-full max-h-[70dvh] border border-muted/20 shadow-lg');

	$effect(() => {
		if (typeof id === 'string') {
			getFileInfos(directus, id).then((data) => {
				// fetchedFile = data;
				type = data.type;
			});
		} else {
			console.log(item);
		}
	});
</script>

{#if type === 'video/mp4'}
	<Video {item} class={classes + 'aspect-video'} style={`top: ${topGap}rem;`} />
{:else if type?.startsWith('image/')}
	<Image {item} class={classes} style={`top: ${topGap}rem;`} />
{/if}
