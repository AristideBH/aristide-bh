import type { PageServerLoad } from './$types';
import { client, directusError } from '$lib/logic/directus';
import { readCategoriesItems, readHomepage, readProjets, readProjetsItems } from '$lib/types/client';
export const load = (async ({ fetch }) => {
    try {
        const directus = client(fetch);
        const home = await directus.request(
            readHomepage({
                fields:
                    ['img', 'presentation', { seo_detail: ["*"] }],

            })
        );
        const projects = await directus.request(
            readProjetsItems({
                filter: { status: { _nin: ['archived', 'draft'] } }
            })
        );
        const categories = await directus.request(
            readCategoriesItems({
                fields: [{ tags: ['title'] }, 'speed'],
            })
        )
        return {
            home, projects, categories
        };

    } catch (error) {
        directusError(error);

    }
}) satisfies PageServerLoad;