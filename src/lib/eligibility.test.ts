import { describe, it, expect } from "vitest";
import {
  ageFromDob,
  checkEligibility,
  hasConditions,
} from "@/lib/eligibility";
import type { EligibilityConditions } from "@/lib/types";

// Minimal conditions builder — everything permissive unless overridden.
function conds(
  over: Partial<EligibilityConditions> = {}
): EligibilityConditions {
  return {
    room_id: "r1",
    age_min: null,
    age_max: null,
    gender: null,
    allow_smoking: true,
    allow_parties: true,
    allow_pets: true,
    house_rules: [],
    min_stay_months: null,
    max_stay_months: null,
    turnover_gap_days: null,
    ...over,
  };
}

describe("ageFromDob", () => {
  const at = new Date("2026-07-12");

  it("computes a straightforward age", () => {
    expect(ageFromDob("2000-01-01", at)).toBe(26);
  });

  it("does not count a birthday that hasn't happened yet this year", () => {
    expect(ageFromDob("2000-12-31", at)).toBe(25);
  });

  it("counts the birthday on the exact day", () => {
    expect(ageFromDob("2000-07-12", at)).toBe(26);
  });

  it("does not count the day before the birthday", () => {
    expect(ageFromDob("2000-07-13", at)).toBe(25);
  });
});

describe("checkEligibility", () => {
  it("passes when there are no conditions", () => {
    const r = checkEligibility(null, {});
    expect(r.passed).toBe(true);
    expect(r.reasons).toEqual([]);
  });

  it("blocks below the minimum age", () => {
    const r = checkEligibility(conds({ age_min: 18 }), {
      dateOfBirth: "2015-01-01",
    });
    expect(r.passed).toBe(false);
    expect(r.reasons).toContain("age_min");
  });

  it("blocks above the maximum age", () => {
    const r = checkEligibility(conds({ age_max: 30 }), {
      dateOfBirth: "1980-01-01",
    });
    expect(r.reasons).toContain("age_max");
  });

  it("does not evaluate age when no date of birth is given", () => {
    const r = checkEligibility(conds({ age_min: 18, age_max: 30 }), {});
    expect(r.passed).toBe(true);
  });

  it("blocks a mismatched gender but ignores 'any'", () => {
    expect(
      checkEligibility(conds({ gender: "female" }), { gender: "male" }).reasons
    ).toContain("gender");
    expect(
      checkEligibility(conds({ gender: "any" }), { gender: "male" }).passed
    ).toBe(true);
  });

  it("enforces minimum and maximum stay in months", () => {
    const shortStay = checkEligibility(conds({ min_stay_months: 6 }), {
      checkIn: "2026-09-01",
      checkOut: "2026-11-01",
    });
    expect(shortStay.reasons).toContain("min_stay");

    const longStay = checkEligibility(conds({ max_stay_months: 12 }), {
      checkIn: "2026-01-01",
      checkOut: "2027-06-01",
    });
    expect(longStay.reasons).toContain("max_stay");

    const okStay = checkEligibility(
      conds({ min_stay_months: 3, max_stay_months: 12 }),
      { checkIn: "2026-01-01", checkOut: "2026-07-01" }
    );
    expect(okStay.passed).toBe(true);
  });

  it("accumulates multiple reasons and writes notes", () => {
    const r = checkEligibility(conds({ age_min: 18, gender: "female" }), {
      dateOfBirth: "2015-01-01",
      gender: "male",
    });
    expect(r.reasons).toEqual(expect.arrayContaining(["age_min", "gender"]));
    expect(r.notes).toMatch(/blocked: /);
  });
});

describe("hasConditions", () => {
  it("is false for null or all-permissive conditions", () => {
    expect(hasConditions(null)).toBe(false);
    expect(hasConditions(conds())).toBe(false);
  });

  it("is true when any real restriction exists", () => {
    expect(hasConditions(conds({ age_min: 18 }))).toBe(true);
    expect(hasConditions(conds({ allow_pets: false }))).toBe(true);
    expect(hasConditions(conds({ house_rules: ["Quiet after 10pm"] }))).toBe(
      true
    );
    expect(hasConditions(conds({ gender: "any" }))).toBe(false);
  });
});
