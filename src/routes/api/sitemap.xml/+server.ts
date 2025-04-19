import { PUBLIC_SITE_URL } from "$env/static/public";
import { client } from "$lib/logic/directus";
import { getHomepage, listPages, listProjets, type Collections } from "$lib/types/client";
import { promisify } from "util";
import { gzip } from "zlib";
import type { RequestHandler } from "./$types";

enum Frequency {
    ALWAYS = "always",
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    NEVER = "never",
}

enum Priority {
    VERY_HIGH = "1.0",
    HIGH = "0.8",
    NORMAL = "0.5",
    LOW = "0.3",
    VERY_LOW = "0.1",
}

interface SitemapEntry {
    path: string;
    lastmod: string;
    frequency: Frequency;
    priority: Priority;
}

type Page = Partial<Collections.Pages>;
type Project = Partial<Collections.Projets>;
type Homepage = Partial<Collections.Homepage>;
type ContentToIndex = Page | Project | Homepage;

const compress = promisify(gzip);
const defaultFrequency = Frequency.WEEKLY;
const defaultPriority = Priority.NORMAL as Priority;
const filter = {
    _and: [
        { status: { _nin: ["archived", "draft"] } },
        { seo: { _nnull: true } },
    ],
};

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

const manualEntries: SitemapEntry[] = [];

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

        const homepage = await directus.request(
            getHomepage({ fields: ["seo", "date_updated"] })
        );

        const convertToSitemapEntries = (
            items: ContentToIndex[],
            pathPrefix: string = ""
        ): SitemapEntry[] => {
            return items
                .filter(item => !item?.seo?.no_index)
                .map(item => {
                    let path: string | null = null;

                    if (
                        (item as Page).permalink !== undefined &&
                        (item as Page).permalink
                    ) {
                        path = `${pathPrefix}/${(item as Page).permalink}`;
                    } else if ((item as Project).slug !== undefined && (item as Project).slug) {
                        path = `${pathPrefix}/${(item as Project).slug}`;
                    } else {
                        path = "/";
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
            ...convertToSitemapEntries([homepage], "/"),
            ...manualEntries,
            ...convertToSitemapEntries(pages, ""),
            ...convertToSitemapEntries(projects, "/projets"),
        ];

        const getLastModified = (entries: SitemapEntry[]) => {
            return new Date(Math.max(...entries.map(e => new Date(e.lastmod).getTime()))).toISOString();
        };

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <?xml-stylesheet type="text/xsl" href="/sitemap-theme.xsl"?>
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
