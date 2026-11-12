import type { MetadataRoute } from "next";
import { EXPERIMENTS, SERVICES, SITE } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE.url}${path}`, lastModified: now, priority });
  return [
    page("/", 1),
    page("/services", 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.9)),
    page("/engage", 0.8),
    ...EXPERIMENTS.map((e) => page(`/work/${e.slug}`, 0.7)),
    page("/about", 0.6),
  ];
}
