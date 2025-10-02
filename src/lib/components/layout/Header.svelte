<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$components/ui/button';
	import Logo from '$lib/components/layout/Logo.svelte';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { loading } from '$lib/logic/pageLoading.svelte';
	import { clipPath } from '$lib/logic/transition';
	import { quartOut } from 'svelte/easing';
	import LoadingBar from './LoadingBar.svelte';
	import { dirhover } from '@arisbh/dirhover-svelte';

	let { project_name, project_descriptor } = page.data.global;

	const handleClick = (e: MouseEvent) => {
		e.preventDefault();
		if (page.data.pathName === '/') {
			// scroll to the top of the page smoothly
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		} else {
			// navigate to the page set via the href on the the anchor tag
			const target = e.target as HTMLElement;
			goto((target.parentElement as HTMLAnchorElement)?.href || '/');
		}
	};
</script>

<header
	class="sticky bottom-0 z-50 mt-auto py-6"
	transition:clipPath={{ direction: 'DOWN', duration: 400, easing: quartOut }}
>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button href="/" title="Page d'accueil" class="p-0" onclick={handleClick}>
				<Logo
					class="group select-none bg-white transition-colors"
					padding={true}
					{@attach dirhover({
						childClass: '!size-10 flex item-center justify-center group-hover:fill-white',
						curtainClass: '!bg-primary'
					})}
				/>
			</Button>
			<p class="leading-4">
				<span class="font-heading text-2xl font-extrabold">{project_name}</span>
				<br />
				<span class="small hidden font-mono italic text-primary sm:block">{project_descriptor}</span
				>
			</p>
		</div>
		<Navigation />
	</div>
	{#if $loading}
		<LoadingBar />
	{/if}
</header>
