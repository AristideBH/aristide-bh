<script lang="ts">
	import type { Collections } from '$types/client';

	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut, quartOut } from 'svelte/easing';
	import { Eye } from 'lucide-svelte';
	import { slide, fly } from 'svelte/transition';
	import Image from '../image/Image.svelte';

	export let project: Partial<Collections.Projets> | any;
	let linkWidth: number;
	let linkHeight: number;
	let duration = 1500;

	const x = tweened(0, { duration: duration, easing: cubicOut });
	const y = tweened(0, { duration: duration, easing: cubicOut });

	onMount(() => resetGlow());

	const resetGlow = () => {
		$x = linkWidth;
		$y = linkHeight;
	};

	const cardEffect = (node: HTMLElement) => {
		const glow = node.querySelector('[data-glow]') as HTMLElement;
		if (!glow) return;

		node.onpointermove = (event) => {
			const { offsetX, offsetY } = event;
			$x = offsetX;
			$y = offsetY;
		};
		node.onpointerleave = (event) => {
			resetGlow();
		};
	};
</script>

<a
	use:cardEffect
	bind:offsetWidth={linkWidth}
	bind:offsetHeight={linkHeight}
	transition:slide={{ axis: 'y', duration: 500, easing: quartOut }}
	href="/projets/{project.slug}"
	class="group relative aspect-auto w-full overflow-hidden rounded-lg border bg-card p-6 text-card-foreground no-underline shadow-sm
	{$$props.class ?? ''} "
>
	{#if project.thumbnail && typeof project.thumbnail != 'string'}
		<Image
			item={project.thumbnail.id}
			class="pointer-events-none absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	<span
		style:--x={`${$x}px`}
		style:--y={`${$y}px`}
		data-glow
		class="pointer-events-none absolute inset-0 h-full w-full bg-black/10"
	/>

	<div class="pointer-events-none absolute bottom-6 right-6">
		<Eye
			class="stroke-foreground opacity-0 transition-opacity duration-700 group-hover:opacity-100"
		/>
	</div>

	<div class="pointer-events-none isolate flex h-full grow flex-col justify-start space-y-1">
		<h3 class="mt-0 text-3xl font-semibold leading-none tracking-wide">
			{project.title}
		</h3>
		{#if project.subtitle}
			<p
				class="text-balance text-sm text-muted-foreground mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
			>
				{project.subtitle}
			</p>
		{/if}
	</div>
</a>

<style>
	[data-glow] {
		--x: 0px;
		--y: 0px;
		color: hsla(var(--foreground) / 50%);
		background: radial-gradient(
			circle at var(--x) var(--y),
			hsla(var(--background) / 7.5%) 0%,
			hsl(var(--card) / 90%) 85%
		);
	}
</style>
