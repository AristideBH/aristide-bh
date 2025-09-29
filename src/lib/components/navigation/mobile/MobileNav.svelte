<script lang="ts">
	import type { Collections } from '$lib/types/client';

	import * as Drawer from '$lib/components/ui/drawer';
	import Menu from 'lucide-svelte/icons/menu';
	import NavItemFragment from '../NavItemFragment.svelte';
	import NavItemSub from '../mobile/NavItemSub.svelte';
	import { closeDrawer, isDrawerOpen } from './index.svelte';
	import { dirhover } from '@arisbh/dirhover-svelte';

	type Props = {
		menu: Collections.Menus;
	};

	let { menu }: Props = $props();
</script>

<Drawer.Root bind:open={$isDrawerOpen}>
	<Drawer.Trigger
		class=" group h-full bg-white p-3"
		aria-label="Menu"
		{@attach dirhover({
			childClass: '!size-6 flex item-center justify-center group-hover:fill-white',
			curtainClass: '!bg-primary'
		})}
	>
		<Menu
			class="text-foreground transition-all group-hover:text-background dark:text-background dark:group-hover:text-foreground"
		/>
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
