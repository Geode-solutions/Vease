// Pure helpers for the desktop updater, kept free of Electron imports so they can be unit tested

type UpdateChannel = "master" | "next";

interface UpdateSettings {
  channel: UpdateChannel;
  pinnedVersion?: string;
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

function sortedTags(tags: string[], filter: (parsed: ParsedTag) => boolean): string[] {
  return tags
    .filter((tag) => tag.startsWith("v"))
    .map((tag) => ({ tag, parsed: parseTag(tag) }))
    .filter(
      (entry): entry is { tag: string; parsed: ParsedTag } =>
        entry.parsed !== undefined && filter(entry.parsed),
    )
    .toSorted((first, second) => compareParsed(second.parsed, first.parsed))
    .map((entry) => entry.tag);
}

function selectTargetTag(tags: string[], settings: UpdateSettings): string | undefined {
  if (settings.pinnedVersion !== undefined) {
    const pinnedTag = `v${settings.pinnedVersion}`;
    return tags.includes(pinnedTag) ? pinnedTag : undefined;
  }
  const candidates = sortedTags(
    tags,
    (parsed) => settings.channel === "next" || parsed.releaseCandidate === undefined,
  );
  return candidates[0];
}

function listStableVersions(tags: string[]): string[] {
  return sortedTags(tags, (parsed) => parsed.releaseCandidate === undefined).map((tag) =>
    tag.slice(1),
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
  selectTargetTag,
  type ParsedTag,
  type UpdateChannel,
  type UpdateSettings,
};
