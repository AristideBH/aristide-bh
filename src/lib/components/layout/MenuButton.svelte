<script lang="ts">
	import { quartOut } from 'svelte/easing';
	import { clipPath } from '$logic/transition';
	// import { menu } from '$logic/menu';
	import { fade, slide } from 'svelte/transition';

	// * TYPES
	interface CustomMouseEvent extends MouseEvent {
		layerX: number;
		layerY: number;
	}

	type MouseDirection = 'top' | 'center' | 'bottom' | 'left' | 'right';
	type ScrollDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

	// * DEFAULTS
	let scrollY: number = 0;
	export let duration = 300;
	export let mouseCurtainBg: string = 'hsl(var(--primary))';
	export let scrollCurtainBg: string = 'hsl(var(--background))';
	// export let scroll: {
	// 	triggerValue: number;
	// 	in: ScrollDirection;
	// 	out: ScrollDirection;
	// } = { triggerValue: 50, in: 'RIGHT', out: 'LEFT' };

	// * SLOT CHECK
	let renderComponent = true;
	if (!$$slots.default) {
		console.warn('Please add an element inside <MenuBarButton/>. Component not initiated.');
		renderComponent = false;
	}

	// * FUNCTIONS

	const getCSSVariable = (target: HTMLElement, variable: string) =>
		parseFloat(getComputedStyle(target).getPropertyValue(variable));

	const mouseDirection = (e: CustomMouseEvent): MouseDirection => {
		const { target, layerX, layerY } = e;
		const node = {
			width: (target as HTMLElement).getBoundingClientRect().width,
			height: (target as HTMLElement).getBoundingClientRect().height
		};
		const min = 10,
			max = 100 - min;

		const calcValue = (
			value: number,
			on: number,
			minPos: MouseDirection,
			centerPos: MouseDirection,
			maxPos: MouseDirection
		) => {
			const percentage = Math.abs((value / on) * 100);
			if (percentage >= 0 && percentage <= min) {
				return minPos;
			} else if (percentage >= min && percentage <= max) {
				return centerPos;
			} else if (percentage >= max && percentage <= 100) {
				return maxPos;
			} else {
				return maxPos;
			}
		};

		const x = calcValue(layerX, node.width, 'left', 'center', 'right');
		const y = calcValue(layerY, node.height, 'top', 'center', 'bottom');

		if (x === 'center' && y !== 'center') {
			return y;
		} else if (y === 'center' && x !== 'center') {
			return x;
		} else {
			return 'bottom';
		}
	};

	const trackerPositionsFor = (e: CustomMouseEvent) => {
		const direction = mouseDirection(e);
		return direction === 'bottom'
			? [0, 100]
			: direction === 'top'
				? [0, -100]
				: direction === 'right'
					? [100, 0]
					: direction === 'left'
						? [-100, 0]
						: [0, 100];
	};

	// * EVENT HANDLER
	const handleMouseAction = (e: CustomMouseEvent) => {
		const target = e.target as HTMLElement;
		const [x, y] = trackerPositionsFor(e);
		const isEnter = e.type === 'mouseenter' ? true : false;

		if (isEnter) {
			// Set CSS variable accordingly to direction
			target.style.setProperty('--x-pos', x + '%');
			target.style.setProperty('--y-pos', y + '%');
		}

		// Get the current values of --x-pos and --y-pos
		const startX = getCSSVariable(target, '--x-pos');
		const startY = getCSSVariable(target, '--y-pos');
		const start = performance.now();

		const animate = (timestamp: number) => {
			const progress = (timestamp - start) / duration;
			const easedProgress = quartOut(progress);

			if (progress < 1) {
				const deltaX = isEnter ? 0 - startX : x;
				const deltaY = isEnter ? 0 - startY : y;

				target.style.setProperty('--x-pos', `${startX + easedProgress * deltaX}%`);
				target.style.setProperty('--y-pos', `${startY + easedProgress * deltaY}%`);

				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};

	// * ACTION
	const dirHover = (targetNode: HTMLElement) => {
		// Exit if more than one element is slotted in the component
		if (targetNode.children.length > 1) {
			console.warn('Please only wrap one element inside <MenuBarButton/>. Action not initiated.');
			return;
		}

		// Copy content and empty slotted node
		const slotted = targetNode.children[0] as HTMLElement;
		// console.log('🩺 > dirHover > slotted:', slotted);
		const childInnerHTML = slotted.innerHTML;
		const childInnerDisplay = slotted.style.display;
		slotted.setAttribute('data-dirhover', 'slotted');
		slotted.innerHTML = '';

		// Recreate slotted content
		const content = document.createElement('span');
		content.innerHTML = childInnerHTML;
		content.style.display = childInnerDisplay;
		content.setAttribute('data-dirhover', 'content');

		// Create tracker element
		const mouseCurtain = document.createElement('span');
		mouseCurtain.setAttribute('data-curtain', 'mouse');

		// Add created elements
		slotted.append(mouseCurtain, content);

		// Add eventListeners
		slotted.addEventListener('mouseenter', (e) => handleMouseAction(e as CustomMouseEvent));
		slotted.addEventListener('mouseleave', (e) => handleMouseAction(e as CustomMouseEvent));

		return {
			destroy() {
				slotted.removeEventListener('mouseenter', (e) => handleMouseAction(e as CustomMouseEvent));
				slotted.removeEventListener('mouseleave', (e) => handleMouseAction(e as CustomMouseEvent));
			}
		};
	};
</script>

<svelte:window bind:scrollY />

{#if renderComponent}
	<div
		use:dirHover
		data-dirhover="wrapper"
		style:--mouse-curtain-bg={mouseCurtainBg}
		style:--scroll-curtain-bg={scrollCurtainBg}
		class="{$$props.class ?? ''} pointer-events-auto"
	>
		<slot />
		<!-- {#if scrollY > scroll.triggerValue}
			<span
				in:clipPath|local={{ direction: scroll.in, duration: duration }}
				out:clipPath|local={{ direction: scroll.out, duration: duration }}
				data-curtain="scroll"
			></span>
		{/if} -->
	</div>
{/if}

<style>
	:global([data-dirhover='wrapper']) {
		position: relative;
		overflow: hidden;
		width: fit-content;
	}

	:global([data-dirhover='slotted']) {
		position: relative;
		--x-pos: 0%;
		--y-pos: 100%;
	}

	:global([data-dirhover='content']) {
		z-index: 1;
		display: flex;
		gap: 1rem;
	}

	:global([data-curtain='mouse']) {
		background-color: var(--mouse-curtain-bg);
		position: absolute;
		inset: 0;
		will-change: translate;
		translate: var(--x-pos) var(--y-pos);
	}

	:global([data-curtain='scroll']) {
		background-color: var(--scroll-curtain-bg);
		position: absolute;
		inset: 0;
		pointer-events: none;
		mix-blend-mode: color-burn;
	}
</style>
