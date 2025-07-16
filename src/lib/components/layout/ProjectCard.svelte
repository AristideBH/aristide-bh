<script lang="ts">
	import type { Collections } from '$types/client';

	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, quartOut } from 'svelte/easing';
	import { Eye } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import Image from '../image/Image.svelte';

	interface Props {
		project: Partial<Collections.Projets> | any;
		[key: string]: any;
		onclick?: (event: MouseEvent) => void;
	}

	let { ...props }: Props = $props();
	let linkWidth: number | undefined = $state();
	let linkHeight: number | undefined = $state();
	let duration = 350;

	const x = new Tween(650, { duration: duration, easing: cubicOut });
	const y = new Tween(650, { duration: duration, easing: cubicOut });

	onMount(() => resetGlow());

	const resetGlow = () => {
		if (typeof linkWidth !== 'number' || typeof linkHeight !== 'number') return;
		x.set(linkWidth);
		y.set(linkHeight);
	};

	const cardEffect = (node: HTMLElement) => {
		const glow = node.querySelector('[data-glow]') as HTMLElement;
		if (!glow) return;

		node.onpointermove = ({ offsetX, offsetY }) => {
			x.set(offsetX);
			y.set(offsetY);
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
	href="/projets/{props.project.slug}"
	class="group relative aspect-projectMin h-full w-full overflow-hidden rounded border bg-card text-card-foreground no-underline shadow-lg md:aspect-project
	{props.class ?? ''} "
	{...props}
>
	{#if props.project.thumbnail}
		<Image
			item={props.project.thumbnail}
			class="pointer-events-none absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	<span
		style:--x={`${x.current}px`}
		style:--y={`${y.current}px`}
		data-glow
		class="pointer-events-none absolute inset-0 h-full w-full bg-black/10 print:hidden"
	></span>

	<div class="pointer-events-none absolute bottom-6 right-6">
		<Eye
			class="stroke-foreground opacity-0 transition-opacity duration-700 group-hover:opacity-100"
		/>
	</div>

	<div
		class="pointer-events-none absolute left-6 top-6 isolate flex h-full grow flex-col justify-start space-y-1"
	>
		<h2 class="mb-0.5 mt-0 text-3xl font-semibold leading-none tracking-wide">
			{props.project.title}
		</h2>
		{#if props.project.subtitle}
			<p
				class="text-balance text-sm text-muted-foreground mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
			>
				{props.project.subtitle}
			</p>
		{/if}
	</div>
</a>

<style>
	[data-glow] {
		--x: 0px;
		--y: 0px;
		background: radial-gradient(
			circle at var(--x) var(--y),
			hsla(var(--primary) / 7.5%) 0%,
			hsl(var(--card) / 90%) 85%
		);
	}
</style>
