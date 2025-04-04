<script lang="ts">
	import { handleContact } from '$lib/logic/email';
	import Marqueeck from '@arisbh/marqueeck';

	const mail = 'aristide.bruneau@gmail.com';
</script>

<Marqueeck
	options={{ speed: 43, direction: 'left', gap: 56 }}
	class="layout-full -rotate-3 "
	--marqueeck-padding-y="1.5rem"
	--marqueeck-bg-color="hsl(var(--primary))"
	onClick={() => handleContact(mail)}
>
	<span class="font-heading font-semibold text-background ~text-4xl/6xl">
		{mail}
	</span>
</Marqueeck>
