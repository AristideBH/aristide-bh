<script lang="ts">
	import '../app.pcss';
	import { client, type DirectusClient } from '$lib/logic/directus';
	import { setContext } from 'svelte';

	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
	const directus = client(fetch, data.token);
	setContext<DirectusClient>('directus', directus);

	let scrollY = $state(0);
	let heightY = $state(0);
	let percent = $derived((scrollY / heightY) * 100);
</script>

<svelte:window bind:scrollY bind:outerHeight={heightY} />

<!-- UTILITIES -->
<ModeWatcher darkClassNames={['dark', 'cc--darkmode']} />
<Toaster />

<!-- MARKUP -->
<Main transitionKey={data.pathName} options={{ duration: 100, y: 20, delta: 0 }}>
	{@render children?.()}
</Main>

{#if percent > 20 || (page.data.pathName !== '/' && page.data.pathName !== '/maintenance')}
	<Header />
{/if}

{#if !data.global.maintenance_state}
	<CookieConsent />
{/if}
