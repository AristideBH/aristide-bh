import { type Collections } from "$lib/types/client"
export enum Frequency {
    ALWAYS = "always",
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    NEVER = "never",
}

export enum Priority {
    VERY_HIGH = "1.0",
    HIGH = "0.8",
    NORMAL = "0.5",
    LOW = "0.3",
    VERY_LOW = "0.1",
}

export interface SitemapEntry {
    path: string;
    lastmod: string;
    frequency: Frequency;
    priority: Priority;
}

type Page = Partial<Collections.Pages>;
type Project = Partial<Collections.Projets>;
export type PageOrProject = Page | Project;