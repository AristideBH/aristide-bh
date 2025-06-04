<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		borderThreshold?: number;
		animationDuration?: number;
		animationEase?: string;
		children?: Snippet;
		class?: string;
	};

	let {
		borderThreshold = 7,
		animationDuration = 0.15,
		animationEase = 'cubic-bezier(.58,.86,.38,1)',
		children,
		class: className
	}: Props = $props();

	let animationClass = $state('');
	let container: HTMLDivElement | undefined;
	let overlay: HTMLSpanElement | undefined;
	let overlayStyle = $derived(`transition: transform ${animationDuration}s ${animationEase};`);

	function getMouseBorder(event: MouseEvent): string | null {
		if (!container) return null;
		const rect = container.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const width = rect.width;
		const height = rect.height;
		const threshold = borderThreshold;

		if (y <= threshold) return 'top';
		if (y >= height - threshold) return 'bottom';
		if (x <= threshold) return 'left';
		if (x >= width - threshold) return 'right';
		return null;
	}

	function handleMouseEnter(event: MouseEvent) {
		const border = getMouseBorder(event);
		if (border && overlay) {
			overlay.style.transitionDuration = `0s`;
			if (border === 'top') {
				overlay.style.transform = 'translateY(-101%) translateX(0)';
			} else if (border === 'bottom') {
				overlay.style.transform = 'translateY(101%) translateX(0)';
			} else if (border === 'left') {
				overlay.style.transform = 'translateX(-101%) translateY(0)';
			} else if (border === 'right') {
				overlay.style.transform = 'translateX(101%) translateY(0)';
			}

			//wait one second
			setTimeout(() => {
				if (overlay) {
					overlay.style.transform = '';
					overlay.style.transitionDuration = `${animationDuration}s`;
				}
				animationClass = `enter-to-center`;
			}, 15);
		} else {
			animationClass = '';
		}
	}

	function handleMouseLeave(event: MouseEvent) {
		const border = getMouseBorder(event);
		if (border) {
			animationClass = `leave-${border}`;
		} else {
			animationClass = '';
		}
	}
</script>

<div
	bind:this={container}
	class="relative h-fit w-fit overflow-hidden {className ?? ''} flex"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="region"
	aria-label="Interactive hover area"
>
	<span
		bind:this={overlay}
		class="pointer-events-none absolute inset-0 flex bg-primary {animationClass} "
		style={overlayStyle}
	></span>
	{@render children?.()}
</div>

<style>
	div > span {
		transform: translateX(0%) translateY(101%);
	}
	:global(body) {
		--enter-to-center-transform: translateY(0%) translateX(0%);
		--leave-top-transform: translateY(-101%);
		--leave-bottom-transform: translateY(101%);
		--leave-left-transform: translateX(-101%);
		--leave-right-transform: translateX(101%);
	}

	.enter-to-center {
		transform: var(--enter-to-center-transform);
	}

	.leave-top {
		transform: var(--leave-top-transform);
	}

	.leave-bottom {
		transform: var(--leave-bottom-transform);
	}

	.leave-left {
		transform: var(--leave-left-transform);
	}

	.leave-right {
		transform: var(--leave-right-transform);
	}
</style>
