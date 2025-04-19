<script lang="ts">
	import { directusError, type DirectusClient } from '$lib/logic/directus';
	import { updateMe, withToken } from '@directus/sdk';
	import { getContext } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';

	const directus = getContext<DirectusClient>('directus');
	let user = $state(page.data.user);
	let token = $state(page.data.token);

	type Props = {
		class?: string;
	};
	let { class: className }: Props = $props();

	async function updateProfile() {
		try {
			await directus.request(
				withToken(
					token,
					updateMe({
						first_name: user.first_name,
						last_name: user.last_name,
						title: user.title
					})
				)
			);
			toast.success('Profile updated successfully');
		} catch (e) {
			directusError(e, true);
		}
	}
</script>

<!-- <pre>{JSON.stringify(token, null, 2)}</pre> -->

<Card.Root class="w-full max-w-xl bg-muted">
	<Card.Header>
		<Card.Title class="mt-0 text-3xl">Profile</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4 ">
		<div class="inputWrapper">
			<Label for="first_name">First name</Label>
			<Input id="first_name" bind:value={user.first_name} />
		</div>
		<div class="inputWrapper">
			<Label for="last_name">Last name</Label>
			<Input id="last_name" bind:value={user.last_name} />
		</div>
		<div class="inputWrapper">
			<Label for="email">Email</Label>
			<Input id="email" disabled={true} required type="email" bind:value={user.email} />
		</div>
		<div class="inputWrapper">
			<Label for="title">Title</Label>
			<Input id="title" bind:value={user.title} />
		</div>
	</Card.Content>
	<Card.Footer>
		<Button class="ms-auto w-fit " onclick={updateProfile}>Update profile</Button>
	</Card.Footer>
</Card.Root>

<style lang="postcss">
	.inputWrapper {
		@apply flex flex-col gap-1.5;
	}
</style>
