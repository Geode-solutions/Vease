// Pure helpers and IPC types for the desktop updater, kept free of Electron imports so they can be
// Unit tested and shared with the renderer store

type UpdateChannel = "master" | "next";

interface UpdateSettings {
  channel: UpdateChannel;
  pinnedVersion?: string;
}

type UpdaterState =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "downloaded"
  | "error"
  | "unsupported";

interface UpdaterStatus {
  state: UpdaterState;
  version?: string;
  percent?: number;
  bytesPerSecond?: number;
  transferred?: number;
  total?: number;
  message?: string;
}

interface UpdaterInitialState extends UpdateSettings {
  status: UpdaterStatus;
}

interface ParsedTag {
  major: number;
  minor: number;
  patch: number;
  releaseCandidate?: number;
}

const TAG_REGEX =
  /^v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-rc\.(?<releaseCandidate>\d+))?$/u;

function parseTag(tag: string): ParsedTag | undefined {
  const groups = TAG_REGEX.exec(tag)?.groups;
  if (groups === undefined) {
    return undefined;
  }
  const { major, minor, patch, releaseCandidate } = groups;
  const parsed: ParsedTag = { major: Number(major), minor: Number(minor), patch: Number(patch) };
  if (releaseCandidate !== undefined) {
    parsed.releaseCandidate = Number(releaseCandidate);
  }
  return parsed;
}

function compareParsed(first: ParsedTag, second: ParsedTag): number {
  if (first.major !== second.major) {
    return first.major - second.major;
  }
  if (first.minor !== second.minor) {
    return first.minor - second.minor;
  }
  if (first.patch !== second.patch) {
    return first.patch - second.patch;
  }
  if (first.releaseCandidate === second.releaseCandidate) {
    return 0;
  }
  // A stable release is newer than any of its release candidates
  if (first.releaseCandidate === undefined) {
    return 1;
  }
  if (second.releaseCandidate === undefined) {
    return -1;
  }
  return first.releaseCandidate - second.releaseCandidate;
}

function compareVersions(first: string, second: string): number {
  const parsedFirst = parseTag(first);
  const parsedSecond = parseTag(second);
  if (parsedFirst === undefined || parsedSecond === undefined) {
    throw new Error(`Cannot compare versions "${first}" and "${second}"`);
  }
  return compareParsed(parsedFirst, parsedSecond);
}

const VERSION_PREFIX_REGEX = /^v/u;

function sortedTags(tags: string[], filter: (parsed: ParsedTag) => boolean): string[] {
  return tags
    .map((tag) => ({ tag, parsed: parseTag(tag) }))
    .filter(
      (entry): entry is { tag: string; parsed: ParsedTag } =>
        entry.parsed !== undefined && filter(entry.parsed),
    )
    .toSorted((first, second) => compareParsed(second.parsed, first.parsed))
    .map((entry) => entry.tag);
}

function tagForVersion(version: string): string {
  return `v${version.replace(VERSION_PREFIX_REGEX, "")}`;
}

function selectChannelTag(tags: string[], channel: UpdateChannel): string | undefined {
  const candidates = sortedTags(
    tags,
    (parsed) => channel === "next" || parsed.releaseCandidate === undefined,
  );
  return candidates[0];
}

function listStableVersions(tags: string[]): string[] {
  return sortedTags(tags, (parsed) => parsed.releaseCandidate === undefined).map((tag) =>
    tag.replace(VERSION_PREFIX_REGEX, ""),
  );
}

function defaultChannel(appVersion: string): UpdateChannel {
  return appVersion.includes("-rc.") ? "next" : "master";
}

export {
  compareVersions,
  defaultChannel,
  listStableVersions,
  parseTag,
  selectChannelTag,
  tagForVersion,
  type ParsedTag,
  type UpdateChannel,
  type UpdateSettings,
  type UpdaterInitialState,
  type UpdaterState,
  type UpdaterStatus,
};
