<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$components/ui/button';
	import Logo from '$lib/components/layout/Logo.svelte';
	import MenuButton from '$lib/components/layout/MenuButton.svelte';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { loading } from '$lib/logic/pageLoading.svelte';
	import { clipPath } from '$lib/logic/transition';
	import { quartOut } from 'svelte/easing';
	import LoadingBar from './LoadingBar.svelte';

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
	class="sticky bottom-0 z-50 mt-auto border-t border-foreground/10 bg-background/70 py-6 backdrop-blur-lg"
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
					class="group h-full w-full"
					onclick={handleClick}
				>
					<Logo class="!size-10 transition-all group-hover:fill-white" />
				</Button>
			</MenuButton>
			<p class="hidden leading-4 sm:block">
				<span class="font-heading text-2xl font-extrabold">{project_name}</span>
				<br />
				<span class="small font-mono italic text-primary">{project_descriptor}</span>
			</p>
		</div>
		<Navigation />
	</div>
</header>
