const SECONDS = 1000;
const MINUTES = 60;
const HOURS = 60;
const DAYS = 24;
const WEEKS = 7;
const MONTHS = 30;
const QUARTERS = 4;
const YEARS = 12;

function toDate(dateInput: string | Date): Date {
  if (typeof dateInput === "string") {
    return new Date(dateInput);
  }
  return dateInput;
}

interface TimeDifferences {
  secs: number;
  mins: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
}

function timeDifferences(date: Date): TimeDifferences {
  const diffMs = Date.now() - date.getTime();
  const secs = Math.floor(diffMs / SECONDS);
  const mins = Math.floor(secs / MINUTES);
  const hours = Math.floor(mins / HOURS);
  const days = Math.floor(hours / DAYS);
  const weeks = Math.floor(days / WEEKS);
  const months = Math.floor(days / MONTHS);
  return { secs, mins, hours, days, weeks, months };
}

function ago(count: number, unit: string): string {
  return `${count} ${count === 1 ? unit : `${unit}s`} ago`;
}

export function formatRelativeTime(dateInput: string | Date): string {
  const date = toDate(dateInput);
  const diff = timeDifferences(date);

  if (diff.secs < SECONDS) {
    return "just now";
  }
  if (diff.mins < MINUTES) {
    return ago(diff.mins, "minute");
  }
  if (diff.hours < HOURS) {
    return ago(diff.hours, "hour");
  }
  if (diff.days < DAYS) {
    return ago(diff.days, "day");
  }
  if (diff.weeks < QUARTERS) {
    return ago(diff.weeks, "week");
  }
  if (diff.months < YEARS) {
    return ago(diff.months, "month");
  }

  return date.toLocaleDateString();
}
