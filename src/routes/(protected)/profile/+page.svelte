<script lang="ts">
	import EditProfile from '$lib/components/forms/EditProfile.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SignatureGenerator from './SignatureGenerator.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Aristide BH - Profile</title>
</svelte:head>

<Section>
	<h1 class="text-3xl">Bienvenue {data.user!.first_name}</h1>
</Section>

<Section content={{ template: 'inherit-main' }}>
	<EditProfile />
</Section>

<Section>
	<SignatureGenerator></SignatureGenerator>
</Section>
