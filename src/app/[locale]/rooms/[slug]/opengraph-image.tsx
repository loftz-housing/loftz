import {
  getRoomBySlug,
  getResidenceById,
  getPhotosForRoom,
} from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { loftzOgResponse, ogSize, ogContentType } from "@/lib/og";

export const alt = "LOFTZ room in Lisbon";
export const size = ogSize;
export const contentType = ogContentType;

// Dynamic OG card per room (Next 16 file convention; params are async).
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) {
    return loftzOgResponse({ title: "LOFTZ — Rooms in Lisbon" });
  }
  const [residence, photos] = await Promise.all([
    getResidenceById(room.residence_id),
    getPhotosForRoom(room.id),
  ]);
  return loftzOgResponse({
    photoUrl: photos[0]?.url ?? null,
    eyebrow: [residence?.name, residence?.neighborhood]
      .filter(Boolean)
      .join(" · "),
    title: `${residence?.name ?? "LOFTZ"} · ${room.name}`,
    price: formatPrice(room.monthly_price, locale),
  });
}
