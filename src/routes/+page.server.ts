import type { PageServerLoad } from './$types';
import { client, directusError } from '$lib/logic/directus';
import { readCategoriesItems, readHomepage, readProjets, readProjetsItems } from '$lib/types/client';
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
                    { seo_detail: ["*"] }
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