<script lang="ts">
	import type { Collections } from '$lib/types/client';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import Menu from 'lucide-svelte/icons/menu';
	import * as Drawer from '$lib/components/ui/drawer';
	import NavItemFragment from '../NavItemFragment.svelte';
	import NavItemSub from '../mobile/NavItemSub.svelte';
	import { closeDrawer, isDrawerOpen } from './index.svelte';
	import MenuButton from '$lib/components/layout/MenuButton.svelte';

	type Props = {
		menu: Collections.Menus;
	};

	let { menu }: Props = $props();
	let { project_name, project_descriptor } = page.data.global;
</script>

<Drawer.Root bind:open={$isDrawerOpen}>
	<Drawer.Trigger class="h-full w-12 ">
		<MenuButton class="h-full !w-full shadow-xl">
			<Button variant="white" aria-label="Open menu" class="h-full !w-full">
				<Menu class="size-8" />
			</Button>
		</MenuButton>
	</Drawer.Trigger>
	<Drawer.Content class="max-h-full min-h-[33vh] ">
		<Drawer.Header class="flex items-start gap-3 px-8 pt-8 text-left">
			<a href="/" onclick={closeDrawer}>
				<img
					class="size-11"
					height="44"
					width="44"
					src="/icons/favicon.svg"
					alt="Logo {project_name}"
				/>
			</a>
			<p class="leading-5">
				<span class="font-extrabold">{project_name}</span>
				<br />
				<span class="small">{project_descriptor}</span>
			</p>
		</Drawer.Header>
		<nav class=" flex flex-col gap-8 overflow-auto p-8 pb-28 text-3xl">
			{#each menu.items as item}
				{#if item.type === 'list'}
					<NavItemSub {item} />
				{:else}
					<NavItemFragment {item} onclick={closeDrawer} class="!w-full" />
				{/if}
			{/each}
		</nav>
		<!-- <Drawer.Footer>
			<Drawer.Close>
				<Button variant="outline" class="!ms-auto w-fit hover:bg-muted">Fermer</Button>
			</Drawer.Close>
		</Drawer.Footer> -->
	</Drawer.Content>
</Drawer.Root>
