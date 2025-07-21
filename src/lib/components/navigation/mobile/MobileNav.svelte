<script lang="ts">
	import type { Collections } from '$lib/types/client';

	import MenuButton from '$lib/components/layout/MenuButton.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import Menu from 'lucide-svelte/icons/menu';
	import NavItemFragment from '../NavItemFragment.svelte';
	import NavItemSub from '../mobile/NavItemSub.svelte';
	import { closeDrawer, isDrawerOpen } from './index.svelte';

	type Props = {
		menu: Collections.Menus;
	};

	let { menu }: Props = $props();
</script>

<Drawer.Root bind:open={$isDrawerOpen}>
	<Drawer.Trigger class="aspect-square h-full">
		<MenuButton class="h-full !w-full shadow-xl">
			<Button variant="white" aria-label="Menu" class="group h-full !w-full">
				<Menu
					class="size-8 text-foreground transition-all group-hover:text-background dark:text-background dark:group-hover:text-foreground"
				/>
			</Button>
		</MenuButton>
	</Drawer.Trigger>
	<Drawer.Content class="max-h-full min-h-[33vh] rounded-none">
		<nav class=" flex flex-col items-center gap-8 overflow-auto p-8 pb-24 pt-12 text-3xl">
			{#each menu.items as item}
				{#if item.type === 'list'}
					<NavItemSub {item} />
				{:else}
					<NavItemFragment {item} onclick={closeDrawer} class="!w-fit" />
				{/if}
			{/each}
		</nav>
	</Drawer.Content>
</Drawer.Root>
