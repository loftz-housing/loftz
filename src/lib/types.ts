// Domain types mirroring the Supabase schema (supabase/migrations).

export type PlatformKey =
  | "uniplaces"
  | "spotahome"
  | "housinganywhere"
  | "inlife"
  | "erasmuslisboa";

export type PlatformLinks = Partial<Record<PlatformKey, string>>;

export interface Residence {
  id: string;
  code: string;
  slug: string;
  name: string;
  neighborhood: string | null;
  address: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  bathrooms: number | null;
  facilities: string[];
  cleaning_frequency: string | null;
  floor_plan_url: string | null;
  video_url: string | null;
  sort_index: number;
}

export interface Room {
  id: string;
  residence_id: string;
  slug: string;
  name: string;
  internal_ref: string | null;
  monthly_price: number | null;
  currency: string;
  size_m2: number | null;
  bed_type: string | null;
  private_bathroom: boolean;
  features: string[];
  description: string | null;
  room_contents: string[];
  available_from: string | null;
  ical_url: string | null;
  platform_links: PlatformLinks;
  status: string;
  sort_index: number;
}

export interface Photo {
  id: string;
  residence_id: string;
  room_id: string | null;
  category: "room" | "common" | "other";
  storage_path: string;
  url: string;
  alt: string | null;
  sort_index: number;
}

export interface EligibilityConditions {
  room_id: string;
  age_min: number | null;
  age_max: number | null;
  gender: string | null;
  allow_smoking: boolean;
  allow_parties: boolean;
  allow_pets: boolean;
  house_rules: string[];
  min_stay_months: number | null;
  max_stay_months: number | null;
  turnover_gap_days: number | null;
}

export interface SiteStats {
  residences: number;
  rooms: number;
  neighborhoods: number;
}

export interface RoomWithResidence extends Room {
  residence: Residence;
}

export type Occupation = "student" | "worker" | "other";
export type Gender = "male" | "female" | "other" | "prefer_not";

export interface GuestProfileInput {
  full_name: string;
  email: string;
  nationality?: string | null;
  date_of_birth?: string | null;
  phone?: string | null;
  occupation?: Occupation | null;
  gender?: Gender | null;
}
