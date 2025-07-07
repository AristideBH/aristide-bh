<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { activeAnchor } from '$lib/components/navigation/activeAnchor';

	export let id; // The ID of the anchor element

	let element: HTMLElement; // Reference to the anchor element

	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Option 1: Simple intersection - the first one found that intersects
						// activeAnchor.set(id);

						// Option 2: More robust - determine the 'most visible'
						// This requires checking the intersectionRatio or area for all intersecting elements
						// and setting the one with the highest visibility.
						// For simplicity here, we'll assume a single main element.
						// If multiple elements are intersecting, you might need a more complex logic
						// to determine the "main" one (e.g., highest intersectionRatio).

						// For now, if it intersects and is currently the only one, set it.
						// A more robust solution might involve debouncing and checking all observers.
						activeAnchor.set(id);
					} else {
						// If it's not intersecting and it was previously the active one, clear it.
						// This helps if scrolling quickly past an element.
						activeAnchor.update((currentId) => (currentId === id ? null : currentId));
					}
				});
			},
			{
				root: null, // The viewport
				rootMargin: '0px',
				threshold: 0.5 // Trigger when 50% of the element is visible
			}
		);

		if (element) {
			observer.observe(element);
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div bind:this={element} {id}><slot /></div>
