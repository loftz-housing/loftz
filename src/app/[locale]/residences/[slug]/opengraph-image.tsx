import { getResidenceBySlug, getPhotosForResidence } from "@/lib/data";
import { loftzOgResponse, ogSize, ogContentType } from "@/lib/og";

export const alt = "LOFTZ residence in Lisbon";
export const size = ogSize;
export const contentType = ogContentType;

// Dynamic OG card per residence (Next 16 file convention; params are async).
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const residence = await getResidenceBySlug(slug);
  if (!residence) {
    return loftzOgResponse({ title: "LOFTZ — Residences in Lisbon" });
  }
  const photos = await getPhotosForResidence(residence.id);
  return loftzOgResponse({
    photoUrl: photos[0]?.url ?? null,
    eyebrow: [residence.neighborhood, residence.city]
      .filter(Boolean)
      .join(" · "),
    title: residence.name,
  });
}
