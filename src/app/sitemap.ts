import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getResidences, getRooms } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loftz.net";
const STATIC_PATHS = [
  "",
  "/residences",
  "/book-now",
  "/landlords",
  "/partnerships",
  "/faq",
  "/about",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [residences, rooms] = await Promise.all([getResidences(), getRooms()]);

  const entries: MetadataRoute.Sitemap = [];

  const add = (path: string) => {
    entries.push({
      url: `${SITE_URL}/${routing.defaultLocale}${path}`,
      lastModified: new Date("2026-07-11"),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
        ),
      },
    });
  };

  STATIC_PATHS.forEach(add);
  residences.forEach((r) => add(`/residences/${r.slug}`));
  rooms.forEach((r) => add(`/rooms/${r.slug}`));

  return entries;
}
