// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { type Collections } from '$lib/types/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: string;
			token?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

	}

}

export { };
