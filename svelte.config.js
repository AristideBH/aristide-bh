import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			$lib: "./src/lib",
			$components: './src/lib/components',
			$types: './src/lib/types',
			$logic: './src/lib/logic',
		}
	},
	vitePlugin: {
		inspector: true
	}
};

export default config;
