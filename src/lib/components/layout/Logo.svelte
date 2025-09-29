<script lang="ts">
	import { cn } from '$lib/logic/utils.js';
	type Props = {
		class?: string;
		onclick?: () => void;
		padding?: boolean;
	};

	let { class: className = 'fill-primary', onclick, padding = false, ...props }: Props = $props();
</script>

<div {...props} class={cn(padding ? 'px-3 py-1.5' : '', className ?? '')}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 397.82 175.99"
		{...onclick ? { onclick } : {}}
		class="h-full w-full"
	>
		<path
			d="M397.82 73.99h-50.79l35.91-35.91-21.21-21.21-35.91 35.91V1.99h-30v50.57C266.18 23.17 238.18 0 198.91 0S131.64 23.17 102 52.56V1.99H72v72H0v30h50.79L14.88 139.9l21.21 21.21L72 125.2v50.79h30v-72h72v-30h-51.01C148.63 48.55 170.94 30 198.9 30s50.27 18.55 75.91 43.99H223.8v30h72v72h30v-72h72v-30h.02Z"
		/>
	</svg>
</div>
