import type { PageServerLoad } from './$types';
import { client, directusError } from '$lib/logic/directus';
import { listProjets } from '$lib/types/client';

export const load = (async () => {
    try {
        const directus = client(fetch);
        const projects = await directus.request(
            listProjets({
                filter: { "status": { "_in": ['published'] } },
            })
        )
        return { projects };
    }
    catch (error) {
        directusError(error);
    }
}) satisfies PageServerLoad;