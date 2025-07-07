import type { PageServerLoad } from './$types';
import { client, directusError } from '$lib/logic/directus';
import { listProjets } from '$lib/types/client';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    redirect(301, '/');
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