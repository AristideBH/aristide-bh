import { client, directusError } from '$lib/logic/directus';
import { readCategoriesItems, readHomepage } from '$lib/types/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    try {
        const directus = client(fetch);

        const home = await directus.request(
            readHomepage({
                fields: [
                    'img',
                    'presentation',
                    'nudge_project',
                    { pinned_projects: ['*'] },
                    'contact_text',
                    'contact_nudge',
                    { seo_detail: ["*"] },
                    'seo'
                ],
            })
        );
        const categories = await directus.request(
            readCategoriesItems({
                fields: [{ tags: ['title'] }, 'speed'],
            })
        )

        return {
            home, categories
        };

    } catch (error) {
        directusError(error);

    }
}) satisfies PageServerLoad;