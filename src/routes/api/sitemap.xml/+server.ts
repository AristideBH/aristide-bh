import { PUBLIC_SITE_URL } from "$env/static/public";
import { client } from "$lib/logic/directus";
import { listPages, listProjets } from "$lib/types/client";
import { promisify } from "util";
import { gzip } from "zlib";
import type { RequestHandler } from "./$types";
import { Frequency, Priority, type PageOrProject, type SitemapEntry } from "./types";

const compress = promisify(gzip);
const defaultFrequency = Frequency.WEEKLY;
const defaultPriority = Priority.NORMAL as Priority;
const filter = {
    _and: [
        { status: { _nin: ["archived", "draft"] } },
        { seo: { _nnull: true } },
    ],
};

const manualEntries: SitemapEntry[] = [
    {
        path: "",
        lastmod: new Date().toISOString(),
        frequency: defaultFrequency,
        priority: defaultPriority,
    },
];

const createSitemapEntry = (
    path: string,
    lastmod: string,
    frequency: Frequency,
    priority: Priority
): SitemapEntry => ({
    path,
    lastmod,
    frequency,
    priority,
});

export const GET: RequestHandler = async ({ fetch }) => {
    const directus = client(fetch);

    try {
        const pages = await directus.request(
            listPages({
                filter: filter,
                fields: ["permalink", "date_updated", "seo"],
            })
        );

        const projects = await directus.request(
            listProjets({
                filter: filter,
                fields: ["slug", "date_updated", "seo"],
            })
        );

        const convertToSitemapEntries = (
            items: PageOrProject[],
            pathPrefix: string = "/"
        ): SitemapEntry[] => {
            return items
                .filter(item => !item?.seo?.no_index)
                .map(item => {
                    let path: string | null = null;

                    if ("permalink" in item && item.permalink) {
                        path = `${pathPrefix}/${item.permalink}`;
                    } else if ("slug" in item && item.slug) {
                        path = `${pathPrefix}/${item.slug}`;
                    } else {
                        console.warn("Item missing permalink and slug:", item);
                        return null;
                    }

                    if (!path) return null;

                    const { date_updated, seo } = item;

                    const frequency = seo?.sitemap?.change_frequency || defaultFrequency;
                    const priority = (seo?.sitemap?.priority as Priority) || defaultPriority;

                    return createSitemapEntry(path, date_updated as string, frequency, priority);
                })
                .filter((entry): entry is SitemapEntry => entry !== null);
        };

        const sitemapEntries = [
            ...manualEntries,
            ...convertToSitemapEntries(pages, "/"),
            ...convertToSitemapEntries(projects, "/projets"),
        ];

        const getLastModified = (entries: SitemapEntry[]) => {
            return new Date(Math.max(...entries.map(e => new Date(e.lastmod).getTime()))).toISOString();
        };

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapEntries
                .map(
                    ({ path, lastmod, frequency, priority }) => `
                <url>
                    <loc>${PUBLIC_SITE_URL}${path}</loc>
                    <lastmod>${lastmod}</lastmod>
                    <changefreq>${frequency}</changefreq>
                    <priority>${priority}</priority>
                </url>`
                )
                .join("")}
        </urlset>`.replace(/>\s+</g, "><").trim();

        const compressed = await compress(xml);

        return new Response(compressed, {
            headers: {
                "Cache-Control": "max-age=0, s-maxage=3600",
                "Content-Type": "application/xml",
                "Content-Encoding": "gzip",
                "Last-Modified": getLastModified(sitemapEntries),
            },
        });
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return new Response("Error generating sitemap", { status: 500 });
    }
};
