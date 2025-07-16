<script lang="ts">
	import { page } from '$app/state';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { client, type DirectusClient } from '$lib/logic/directus';
	import { UmamiAnalyticsEnv } from '@lukulent/svelte-umami';
	import { ModeWatcher } from 'mode-watcher';
	import { setContext } from 'svelte';
	import '../app.pcss';

	let { children, data } = $props();
	const directus = client(fetch, data.token);
	setContext<DirectusClient>('directus', directus);

	let scrollY = $state(0);
	let heightY = $state(0);
	let percent = $derived((scrollY / heightY) * 100);
</script>

<svelte:window bind:scrollY bind:outerHeight={heightY} />

<!-- UTILITIES -->
<ModeWatcher
	darkClassNames={['dark', 'cc--darkmode']}
	defaultMode={'system'}
	themeColors={{ dark: 'dark', light: 'light' }}
/>
<Toaster />
<UmamiAnalyticsEnv />

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
