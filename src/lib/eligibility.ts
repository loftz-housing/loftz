import type { EligibilityConditions } from "./types";

export interface EligibilityInput {
  dateOfBirth?: string | null; // ISO date
  gender?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
}

// Machine-readable reason codes; the UI localizes them (messages: eligibility.*).
export type EligibilityReason =
  | "age_min"
  | "age_max"
  | "gender"
  | "min_stay"
  | "max_stay";

export interface EligibilityResult {
  passed: boolean;
  reasons: EligibilityReason[];
  // Human-readable summary in EN for storing in the DB (eligibility_notes).
  notes: string;
}

export function ageFromDob(dob: string, at: Date = new Date()): number {
  const d = new Date(dob);
  let age = at.getFullYear() - d.getFullYear();
  const m = at.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < d.getDate())) age--;
  return age;
}

function monthsBetween(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return (
    (b.getFullYear() - a.getFullYear()) * 12 +
    (b.getMonth() - a.getMonth()) +
    (b.getDate() >= a.getDate() ? 0 : -1)
  );
}

// Evaluate a guest profile against a room's host-set conditions (D-18).
// Missing conditions = no restriction. Missing profile fields don't fail a
// check (we can't disprove eligibility we have no data for).
export function checkEligibility(
  conditions: EligibilityConditions | null,
  input: EligibilityInput
): EligibilityResult {
  const reasons: EligibilityReason[] = [];
  if (!conditions) return { passed: true, reasons, notes: "no conditions" };

  if (input.dateOfBirth) {
    const age = ageFromDob(input.dateOfBirth);
    if (conditions.age_min != null && age < conditions.age_min)
      reasons.push("age_min");
    if (conditions.age_max != null && age > conditions.age_max)
      reasons.push("age_max");
  }

  if (
    conditions.gender &&
    conditions.gender !== "any" &&
    input.gender &&
    input.gender !== conditions.gender
  ) {
    reasons.push("gender");
  }

  if (input.checkIn && input.checkOut) {
    const stay = monthsBetween(input.checkIn, input.checkOut);
    if (conditions.min_stay_months != null && stay < conditions.min_stay_months)
      reasons.push("min_stay");
    if (conditions.max_stay_months != null && stay > conditions.max_stay_months)
      reasons.push("max_stay");
  }

  const passed = reasons.length === 0;
  return {
    passed,
    reasons,
    notes: passed ? "eligible" : `blocked: ${reasons.join(", ")}`,
  };
}

// Does a room carry any real (non-null) conditions worth displaying?
export function hasConditions(c: EligibilityConditions | null): boolean {
  if (!c) return false;
  return (
    c.age_min != null ||
    c.age_max != null ||
    (c.gender != null && c.gender !== "any") ||
    c.min_stay_months != null ||
    c.max_stay_months != null ||
    c.turnover_gap_days != null ||
    c.house_rules.length > 0 ||
    !c.allow_smoking ||
    !c.allow_parties ||
    !c.allow_pets
  );
}
