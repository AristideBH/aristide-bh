<script lang="ts">
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import { page } from '$app/state';
	import { loading } from '$lib/logic/pageLoading.svelte';
	import LoadingBar from './LoadingBar.svelte';
	let { project_name, project_descriptor } = page.data.global;
</script>

<header class="sticky bottom-0 z-50 border-t border-foreground/10 bg-background py-4">
	{#if $loading}
		<LoadingBar />
	{/if}
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/">
				<img height="38" width="60" src="/icons/favicon.svg" alt="Logo {project_name}" />
			</a>
			<!-- <p class="leading-5">
				<span class="font-extrabold">{project_name}</span>
				<br />
				<span class="small">{project_descriptor}</span>
			</p> -->
		</div>
		<Navigation />
	</div>
</header>
