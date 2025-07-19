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
	const directus = getContext<DirectusClient>('directus');
	let id = typeof item === 'string' ? item : item?.id;
	let type = $state<string | undefined | null>('');

	$effect(() => {
		if (typeof id === 'string') {
			getFileInfos(directus, id).then((data) => (type = data.type));
		}
	});
</script>

{#if type?.startsWith('video/')}
	<Video {item} class="aspect-video" />
{:else if type?.startsWith('image/')}
	<Image {item} />
{/if}
