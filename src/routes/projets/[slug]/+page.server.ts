import { getFileInfos } from '$lib/components/image';
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
                            { "status": { "_in": ['published'] } },
                            { "slug": { "_eq": params.slug } }
                        ]
                    },
                    fields: [
                        "*",
                        { thumbnail: ["id"] },
                        { tags: [{ tags_id: ["*"] }] },
                        { gallery: ["directus_files_id"] }
                    ]
                }
            )
        )

        if (projects.length === 0) error(404, "Project not found");
        const project = projects[0];
        if (!project) error(404, "Project not found");
        const gallery = (project.gallery ?? []).map((item) => item.directus_files_id);

        const getGalleryFiles = async () => {
            try {
                const objs = await Promise.all(
                    gallery.map(async (item) => {
                        const file = await getFileInfos(directus, (item as string));
                        return file;
                    })
                );
                return objs;

            } catch (error) {
                directusError(error);
            }
        }


        return {
            project, gallery: await getGalleryFiles(),
        };

    } catch (error) {
        directusError(error);
    }

}) satisfies PageServerLoad;