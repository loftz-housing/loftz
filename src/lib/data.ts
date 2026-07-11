import { cache } from "react";
import { supabase } from "./supabase";
import type {
  Residence,
  Room,
  Photo,
  EligibilityConditions,
  SiteStats,
} from "./types";

// All reads fail soft: on error/empty they return empty results so pages render
// (build must pass before real data/photos are loaded — kickoff guardrail).

export const getResidences = cache(async (): Promise<Residence[]> => {
  const { data, error } = await supabase
    .from("residences")
    .select("*")
    .order("sort_index");
  if (error) {
    console.error("[data] getResidences", error.message);
    return [];
  }
  return data ?? [];
});

export const getResidenceBySlug = cache(
  async (slug: string): Promise<Residence | null> => {
    const { data, error } = await supabase
      .from("residences")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("[data] getResidenceBySlug", error.message);
      return null;
    }
    return data;
  }
);

export const getResidenceById = cache(
  async (id: string): Promise<Residence | null> => {
    const { data, error } = await supabase
      .from("residences")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return data;
  }
);

export const getRooms = cache(async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("status", "active")
    .order("sort_index");
  if (error) {
    console.error("[data] getRooms", error.message);
    return [];
  }
  return data ?? [];
});

export const getRoomsByResidence = cache(
  async (residenceId: string): Promise<Room[]> => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("residence_id", residenceId)
      .eq("status", "active")
      .order("sort_index");
    if (error) {
      console.error("[data] getRoomsByResidence", error.message);
      return [];
    }
    return data ?? [];
  }
);

export const getRoomBySlug = cache(
  async (slug: string): Promise<Room | null> => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("[data] getRoomBySlug", error.message);
      return null;
    }
    return data;
  }
);

export const getPhotosForRoom = cache(
  async (roomId: string): Promise<Photo[]> => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("room_id", roomId)
      .order("sort_index");
    if (error) return [];
    return data ?? [];
  }
);

export const getPhotosForResidence = cache(
  async (residenceId: string): Promise<Photo[]> => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("residence_id", residenceId)
      .order("sort_index");
    if (error) return [];
    return data ?? [];
  }
);

// One representative photo per room (first by sort_index), for list/card views.
export const getRoomCoverPhotos = cache(
  async (): Promise<Record<string, Photo>> => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .not("room_id", "is", null)
      .order("sort_index");
    if (error || !data) return {};
    const covers: Record<string, Photo> = {};
    for (const p of data as Photo[]) {
      if (p.room_id && !covers[p.room_id]) covers[p.room_id] = p;
    }
    return covers;
  }
);

// One representative photo per residence (prefers a common-area photo).
export const getResidenceCoverPhotos = cache(
  async (): Promise<Record<string, Photo>> => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("sort_index");
    if (error || !data) return {};
    const covers: Record<string, Photo> = {};
    for (const p of data as Photo[]) {
      const existing = covers[p.residence_id];
      if (!existing || (existing.room_id !== null && p.room_id === null)) {
        covers[p.residence_id] = p;
      }
    }
    return covers;
  }
);

// A handful of photos for the homepage hero slideshow (one per residence).
export const getHeroPhotos = cache(async (): Promise<string[]> => {
  const covers = await getResidenceCoverPhotos();
  return Object.values(covers)
    .slice(0, 6)
    .map((p) => p.url);
});

export const getAvailabilityForRoom = cache(
  async (roomId: string): Promise<{ start_date: string; end_date: string }[]> => {
    const { data, error } = await supabase
      .from("availability")
      .select("start_date, end_date")
      .eq("room_id", roomId)
      .order("start_date");
    if (error || !data) return [];
    return data;
  }
);

export const getEligibilityForRoom = cache(
  async (roomId: string): Promise<EligibilityConditions | null> => {
    const { data, error } = await supabase
      .from("eligibility_conditions")
      .select("*")
      .eq("room_id", roomId)
      .maybeSingle();
    if (error) return null;
    return data;
  }
);

export const getSettings = cache(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error || !data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.value as string]));
  }
);

export const getStats = cache(async (): Promise<SiteStats> => {
  const { data, error } = await supabase.rpc("site_stats").single();
  if (error || !data) {
    // Fallback: count client-side from other queries.
    const [res, rooms] = await Promise.all([getResidences(), getRooms()]);
    const neighborhoods = new Set(
      res.map((r) => r.neighborhood).filter(Boolean)
    );
    return {
      residences: res.length,
      rooms: rooms.length,
      neighborhoods: neighborhoods.size,
    };
  }
  const d = data as SiteStats;
  return {
    residences: Number(d.residences),
    rooms: Number(d.rooms),
    neighborhoods: Number(d.neighborhoods),
  };
});
