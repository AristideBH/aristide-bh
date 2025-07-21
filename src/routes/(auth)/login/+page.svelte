<script lang="ts">
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section>
	<LoginForm {data} />
</section>
