import type { ConsoleEntry } from "@ogw_front/stores/console";

const MILLISECONDS_IN_SECOND = 1000;
const SLOW_REQUEST_MS = 1000;
const TIME_DIGITS = 2;
const MILLISECOND_DIGITS = 3;
const SECOND_DECIMALS = 1;

const KNOWN_SOURCES = ["back", "viewer", "app", "events"];
const EVENTS_SOURCE = "events";

// "opengeodeweb_back/upload_file" → "upload_file", "opengeodeweb_viewer.model.surfaces.color" → "model.surfaces.color"
const MICROSERVICE_PREFIX = /^(?:[a-z0-9_]+_(?:back|viewer)[/.]|api\/)/u;

interface RouteParts {
  scope: string;
  name: string;
}

function shortRoute(route: string): string {
  return route.replace(MICROSERVICE_PREFIX, "");
}

// The scope ("model.", "local/app/") is shown dimmed so the action name stands out
function routeParts(route: string): RouteParts {
  const short = shortRoute(route);
  let cut = short.lastIndexOf("/") + 1;
  if (cut === 0) {
    cut = short.indexOf(".") + 1;
  }
  return { scope: short.slice(0, cut), name: short.slice(cut) };
}

function pad(value: number, digits: number): string {
  return String(value).padStart(digits, "0");
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const clock = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => pad(part, TIME_DIGITS))
    .join(":");
  return `${clock}.${pad(date.getMilliseconds(), MILLISECOND_DIGITS)}`;
}

function formatDuration(milliseconds: number): string {
  if (milliseconds < MILLISECONDS_IN_SECOND) {
    return `${Math.round(milliseconds)} ms`;
  }
  return `${(milliseconds / MILLISECONDS_IN_SECOND).toFixed(SECOND_DECIMALS)} s`;
}

function isSlow(milliseconds: number): boolean {
  return milliseconds >= SLOW_REQUEST_MS;
}

function isFailed(entry: ConsoleEntry): boolean {
  return entry.status === "error" || entry.status === "timeout";
}

// Known sources first, in a fixed order; extensions after, alphabetically
function sortSources(sources: Iterable<string>): string[] {
  return [...new Set(sources)].toSorted((left, right) => {
    const leftIndex = KNOWN_SOURCES.indexOf(left);
    const rightIndex = KNOWN_SOURCES.indexOf(right);
    if (leftIndex !== -1 || rightIndex !== -1) {
      return (
        (leftIndex === -1 ? KNOWN_SOURCES.length : leftIndex) -
        (rightIndex === -1 ? KNOWN_SOURCES.length : rightIndex)
      );
    }
    return left.localeCompare(right);
  });
}

function matchesSearch(entry: ConsoleEntry, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  return [entry.source, entry.route, entry.label, entry.params, entry.error].some(
    (field) => field !== undefined && field.toLowerCase().includes(needle),
  );
}

export {
  EVENTS_SOURCE,
  KNOWN_SOURCES,
  formatDuration,
  formatTime,
  isFailed,
  isSlow,
  matchesSearch,
  routeParts,
  shortRoute,
  sortSources,
};
