import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { formatRelativeTime } from "@vease/utils/format_date";

const NOW = new Date("2024-06-15T12:00:00.000Z");

const SECOND_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTE_MS = SECONDS_PER_MINUTE * SECOND_MS;
const HOUR_MS = MINUTES_PER_HOUR * MINUTE_MS;
const DAY_MS = HOURS_PER_DAY * HOUR_MS;

const FIFTEEN_MINUTES = 15;
const JUST_NOW_THRESHOLD_SECONDS = 1000;
const SEVENTEEN_MINUTES = 17;
const FIVE_HOURS = 5;
const FIFTY_NINE_HOURS = 59;
const SIXTY_HOURS = 60;
const TWENTY_THREE_DAYS = 23;
const TWENTY_FOUR_DAYS = 24;
const TWENTY_SEVEN_DAYS = 27;
const THIRTY_DAYS = 30;
const SEVENTY_DAYS = 70;
const YEAR_PLUS_DAYS = 360;

function ago(milliseconds: number): Date {
  return new Date(NOW.getTime() - milliseconds);
}

// The unit-conversion constants below double as display thresholds, which
// Shifts every band: "just now" lasts ~16.6 minutes, hours display up to
// ~2.5 days, days display up to 23 days, and weeks can only ever read
// "3 weeks ago". These tests pin down that actual (surprising) behavior.
describe("formatRelativeTime()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns 'just now' for the current instant", () => {
    expect(formatRelativeTime(NOW)).toBe("just now");
  });

  test("accepts an ISO date string as well as a Date", () => {
    expect(formatRelativeTime(NOW.toISOString())).toBe("just now");
  });

  test("still reports 'just now' several minutes in", () => {
    expect(formatRelativeTime(ago(FIFTEEN_MINUTES * MINUTE_MS))).toBe("just now");
  });

  test("switches to minutes once the ~16.6 minute threshold is crossed", () => {
    expect(formatRelativeTime(ago(JUST_NOW_THRESHOLD_SECONDS * SECOND_MS))).toBe("16 minutes ago");
    expect(formatRelativeTime(ago(SEVENTEEN_MINUTES * MINUTE_MS))).toBe("17 minutes ago");
  });

  test("reports hours once the 60 minute mark is passed", () => {
    expect(formatRelativeTime(ago(HOUR_MS))).toBe("1 hour ago");
    expect(formatRelativeTime(ago(FIVE_HOURS * HOUR_MS))).toBe("5 hours ago");
  });

  test("keeps reporting hours up to the ~2.5 day mark", () => {
    expect(formatRelativeTime(ago(FIFTY_NINE_HOURS * HOUR_MS))).toBe("59 hours ago");
  });

  test("switches to days once the 60 hour mark is passed", () => {
    expect(formatRelativeTime(ago(SIXTY_HOURS * HOUR_MS))).toBe("2 days ago");
    expect(formatRelativeTime(ago(TWENTY_THREE_DAYS * DAY_MS))).toBe("23 days ago");
  });

  test("switches to weeks once the 24 day mark is passed, reading '3 weeks ago'", () => {
    expect(formatRelativeTime(ago(TWENTY_FOUR_DAYS * DAY_MS))).toBe("3 weeks ago");
    expect(formatRelativeTime(ago(TWENTY_SEVEN_DAYS * DAY_MS))).toBe("3 weeks ago");
  });

  test("switches to months once the 28 day mark is passed", () => {
    expect(formatRelativeTime(ago(THIRTY_DAYS * DAY_MS))).toBe("1 month ago");
    expect(formatRelativeTime(ago(SEVENTY_DAYS * DAY_MS))).toBe("2 months ago");
  });

  test("falls back to a localized date once diffMonths reaches 12", () => {
    const longAgo = ago(YEAR_PLUS_DAYS * DAY_MS);
    expect(formatRelativeTime(longAgo)).toBe(longAgo.toLocaleDateString());
  });
});
