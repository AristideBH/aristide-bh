import { client, directusError, type CustomDirectusFile } from '$lib/logic/directus';
import { readCategoriesItems, readHomepage } from '$lib/types/client';
import type { PageServerLoad } from './$types';

import { shuffleArray } from '$lib/logic/utils';
import { getFileInfos } from '$lib/components/image';

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
                    { projects_wall: ['directus_files_id'] },
                    'seo'
                ],
            })
        );

        const categories = await directus.request(
            readCategoriesItems({
                fields: [{ tags: ['title'] }, 'speed'],
            })
        )

        const getWallProjectsPools = async (numPools: number = 2): Promise<CustomDirectusFile[][]> => {
            if (!home?.projects_wall) return Array.from({ length: numPools }, () => []);

            const fileInfoPromises = home.projects_wall.map(async (item) => {
                try {
                    const fileInfos = await getFileInfos(directus, (item.directus_files_id as string));
                    return fileInfos;
                } catch (error) {
                    directusError(error);
                    return undefined;
                }
            });

            try {
                const result = await Promise.all(fileInfoPromises);
                const filtered = result.filter((id): id is NonNullable<typeof id> => id !== undefined && id !== null);
                const shuffled = shuffleArray(filtered);

                const pools: CustomDirectusFile[][] = Array.from({ length: numPools }, () => []);
                shuffled.forEach((id, i) => {
                    pools[i % numPools].push(id);
                });

                return pools.map(pool => shuffleArray(pool));
            } catch (error) {
                directusError(error);
                return Array.from({ length: numPools }, () => []);
            }
        };

        return {
            home, categories, wall_projects_pools: await getWallProjectsPools(2)
        };

    } catch (error) {
        directusError(error);
    }
}) satisfies PageServerLoad;