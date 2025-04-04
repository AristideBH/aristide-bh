<script lang="ts">
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { page } from '$app/state';
	import { loading } from '$lib/logic/pageLoading.svelte';
	import LoadingBar from './LoadingBar.svelte';
	let { project_name, project_descriptor } = page.data.global;

	import Logo from '$lib/components/layout/Logo.svelte';
	import MenuButton from '$lib/components/layout/MenuButton.svelte';
	import { Button } from '$components/ui/button';
	import { clipPath } from '$lib/logic/transition';
	import { quartOut } from 'svelte/easing';
	import { goto } from '$app/navigation';

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
	class="sticky bottom-0 z-50 mt-auto border-t border-foreground/10 bg-background/70 py-6 backdrop-blur"
	transition:clipPath={{ direction: 'DOWN', duration: 400, easing: quartOut }}
>
	{#if $loading}
		<LoadingBar />
	{/if}
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<MenuButton class="shadow-xl">
				<Button
					href="/"
					title="Page d'accueil"
					variant="white"
					class="h-full w-full"
					onclick={handleClick}
				>
					<Logo class="!size-10" />
				</Button>
			</MenuButton>
			<p class="leading-4">
				<span class="font-heading text-2xl font-extrabold">{project_name}</span>
				<br />
				<span class="small italic text-primary">{project_descriptor}</span>
			</p>
		</div>
		<Navigation />
	</div>
</header>
