<script lang="ts">
	import '../app.pcss';
	import { client, type DirectusClient } from '$lib/logic/directus';
	import { setContext } from 'svelte';

	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	import Main from '$lib/components/layout/Main.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';

	let { children, data } = $props();
	const directus = client(fetch, data.token);
	setContext<DirectusClient>('directus', directus);
</script>

<!-- UTILITIES -->
<ModeWatcher darkClassNames={['dark', 'cc--darkmode']} />
<Toaster />

<!-- MARKUP -->
<Main transitionKey={data.pathName} options={{ duration: 100, y: 20, delta: 0 }}>
	{@render children?.()}
</Main>

{#if !data.global.maintenance_state}
	<Footer />

	<Header />
	<CookieConsent />
{/if}
