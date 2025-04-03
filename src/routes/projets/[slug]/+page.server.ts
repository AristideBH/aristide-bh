import { client, directusError } from '$lib/logic/directus';
import { listProjets } from '$lib/types/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
    try {
        const directus = client(fetch);
        const projects = await directus.request(
            listProjets(
                {
                    filter: {
                        "_and": [
                            {
                                "status": { "_nin": ['archived', 'draft'] }
                            },
                            {
                                "slug": { "_eq": params.slug }
                            }

                        ]
                    },
                    fields: ["*", { thumbnail: ["id"] },]
                }
            )
        )

        if (projects.length === 0) error(404, "Page not found");

        return {
            project: projects[0],
        };

    } catch (error) {
        directusError(error);
    }



    return {};
}) satisfies PageServerLoad;