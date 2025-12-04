<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { client, type DirectusClient } from '$lib/logic/directus';
	import { UmamiAnalyticsEnv } from '@lukulent/svelte-umami';
	import { ModeWatcher } from 'mode-watcher';
	import { setContext } from 'svelte';
	import '../app.pcss';
	import { SvelteLenis, type Lenis, type OnSetup } from 'svelte-lenis';

	let { children, data } = $props();
	const directus = client(fetch, data.token);
	setContext<DirectusClient>('directus', directus);

	let scrollY = $state(0);
	let heightY = $state(0);
	let percent = $derived((scrollY / heightY) * 100);

	let lenis = $state<Lenis>();
	let lenisOptions = {
		duration: 0.65,
		easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic ease-out, feels natural
		direction: 'vertical',
		gestureDirection: 'vertical',
		smooth: true,
		smoothTouch: false,
		touchMultiplier: 1.2,
		lerp: 0.5,
		infinite: false,
		autoRaf: true
	};

	const onSetup: OnSetup = ({ lenis: instance }) => {
		lenis = instance;
	};
</script>

<svelte:head>
	<meta property="og:image" content="/og_thumbnail.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:title" content="Aristide Bruneau-Heudes | Portfolio" />
	<meta property="og:description" content="Design graphique & Développement web" />
</svelte:head>

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
<SvelteLenis root options={lenisOptions} {onSetup}>
	<Main transitionKey={data.pathName} options={{ duration: 100, y: 20, delta: 0 }}>
		{@render children?.()}
	</Main>
</SvelteLenis>

{#if percent > 20 || (page.data.pathName !== '/' && page.data.pathName !== '/maintenance')}
	<Header {lenis} />
	<img src="/og_thumbnail.png" alt="Open Graph Thumbnail" />
{/if}

<!-- {#if !data.global.maintenance_state}
	<CookieConsent />
{/if} -->
