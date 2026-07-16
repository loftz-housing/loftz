// Shared availability helpers used by the calendar (display), the booking form
// (client-side validation) and the request API (server-side validation).
// Busy ranges are [start_date, end_date) with end exclusive (iCal all-day).

export interface BusyRange {
  start_date: string;
  end_date: string;
}

/** Set of booked YYYY-MM-DD days across all busy ranges. */
export function daysBooked(events: BusyRange[]): Set<string> {
  const set = new Set<string>();
  for (const e of events) {
    const start = new Date(e.start_date + "T00:00:00");
    const end = new Date(e.end_date + "T00:00:00"); // exclusive
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      set.add(d.toISOString().slice(0, 10));
    }
  }
  return set;
}

/** True when check-out is strictly after check-in (both YYYY-MM-DD). */
export function isValidRange(checkIn?: string | null, checkOut?: string | null): boolean {
  if (!checkIn || !checkOut) return false;
  return new Date(checkOut) > new Date(checkIn);
}

/**
 * True when any night in [checkIn, checkOut) falls on a booked day. The
 * check-out day itself is a departure day and is not required to be free.
 */
export function rangeOverlapsBusy(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
  events: BusyRange[]
): boolean {
  if (!checkIn || !checkOut) return false;
  const booked = daysBooked(events);
  const start = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    if (booked.has(d.toISOString().slice(0, 10))) return true;
  }
  return false;
}

/** Today's date as YYYY-MM-DD (local). */
export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

/** The earliest date a guest may check in: max(today, available_from). */
export function minCheckIn(availableFrom?: string | null, now: Date = new Date()): string {
  const today = todayIso(now);
  if (availableFrom && availableFrom > today) return availableFrom;
  return today;
}
