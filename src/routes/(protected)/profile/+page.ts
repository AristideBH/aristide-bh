import type { PageLoad } from './$types';
import { client } from '$lib/logic/directus';
import { readMe, withToken } from "@directus/sdk";
import { directusError } from '$lib/logic/directus';

export const load = (async ({ parent, fetch, }) => {
    const { token } = await parent();
    const directus = client(fetch, token);

    try {
        return {
            user: await directus.request(
                withToken(token!,
                    readMe({ fields: ['*'] }))

            ),
        };
    } catch (e) {
        directusError(e);
    }
}) satisfies PageLoad;