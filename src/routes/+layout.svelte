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
	import GradientBlur from '$lib/components/layout/GradientBlur.svelte';
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

{#if percent > 25 || (page.data.pathName !== '/' && page.data.pathName !== '/maintenance')}
	<Header {lenis} />
{/if}

<GradientBlur />

<!-- {#if !data.global.maintenance_state}
	<CookieConsent />
{/if} -->
