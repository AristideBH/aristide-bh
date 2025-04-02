import type { PageServerLoad } from './$types';
import { client, directusError } from '$lib/logic/directus';
import { readHomepage, readProjets, readProjetsItems } from '$lib/types/client';
export const load = (async ({ fetch }) => {
    try {
        const directus = client(fetch);
        const home = await directus.request(
            readHomepage({ fields: ['img', { seo_detail: ["*"] }] })
        );
        const projects = await directus.request(
            readProjetsItems({
                filter: { status: { _nin: ['archived', 'draft'] } }
            })
        );
        return {
            home, projects
        };

    } catch (error) {
        directusError(error);

    }
}) satisfies PageServerLoad;