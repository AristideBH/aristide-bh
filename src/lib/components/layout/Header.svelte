<script lang="ts">
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { page } from '$app/state';
	import { loading } from '$lib/logic/pageLoading.svelte';
	import LoadingBar from './LoadingBar.svelte';
	let { project_name, project_descriptor } = page.data.global;

	import Logo from '$lib/components/layout/Logo.svelte';
	import MenuButton from '$lib/components/layout/MenuButton.svelte';
	import { Button } from '$components/ui/button';
</script>

<header class="sticky top-0 z-50 border-b border-foreground/10 bg-background py-4">
	{#if $loading}
		<LoadingBar />
	{/if}
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<MenuButton class="shadow-xl">
				<Button href="/" title="Page d'accueil" variant="white" class="h-full w-full ">
					<Logo class="!size-10" />
				</Button>
			</MenuButton>
			<p class="leading-5">
				<span class="font-heading font-extrabold">{project_name}</span>
				<br />
				<span class="small text-primary">{project_descriptor}</span>
			</p>
		</div>
		<Navigation />
	</div>
</header>
