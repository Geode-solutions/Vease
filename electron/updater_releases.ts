// Local imports
import {
  type UpdateSettings,
  listStableVersions,
  selectChannelTag,
  tagForVersion,
} from "./updater_utils";
import { readField } from "./updater_settings";

const GITHUB_REPO = "Geode-solutions/Vease";
const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
const RELEASES_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/download`;
const RELEASES_PER_PAGE = 100;
// Bounds the unauthenticated GitHub API usage (60 requests per hour) when listing versions
const MAX_RELEASE_PAGES = 10;
const VERSION_LIST_TTL_MS = 600_000;
const HTTP_NOT_FOUND = 404;

let versionListCache: { versions: string[]; fetchedAt: number } | undefined = undefined;

async function fetchGitHub(url: string): Promise<Response> {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  return response;
}

function requestError(response: Response): Error {
  return new Error(`GitHub releases request failed: ${response.status} ${response.statusText}`);
}

async function fetchReleasesPage(page: number): Promise<unknown[]> {
  const response = await fetchGitHub(
    `${RELEASES_API_URL}?per_page=${RELEASES_PER_PAGE}&page=${page}`,
  );
  if (!response.ok) {
    throw requestError(response);
  }
  const releases: unknown = await response.json();
  if (!Array.isArray(releases)) {
    throw new TypeError("Unexpected GitHub releases response");
  }
  const releaseList: unknown[] = releases;
  return releaseList;
}

// GitHub lists releases newest first, so later pages are only needed for the full version list
async function fetchReleasesFrom(page: number): Promise<unknown[]> {
  const releases = await fetchReleasesPage(page);
  if (releases.length < RELEASES_PER_PAGE || page >= MAX_RELEASE_PAGES) {
    return releases;
  }
  return [...releases, ...(await fetchReleasesFrom(page + 1))];
}

function releaseTags(releases: unknown[]): string[] {
  return releases
    .filter((release) => readField(release, "draft") !== true)
    .map((release) => readField(release, "tag_name"))
    .filter((tag): tag is string => typeof tag === "string");
}

async function releaseExists(tag: string): Promise<boolean> {
  const response = await fetchGitHub(`${RELEASES_API_URL}/tags/${encodeURIComponent(tag)}`);
  if (response.status === HTTP_NOT_FOUND) {
    return false;
  }
  if (!response.ok) {
    throw requestError(response);
  }
  return true;
}

async function listVersions(): Promise<string[]> {
  if (versionListCache && Date.now() - versionListCache.fetchedAt < VERSION_LIST_TTL_MS) {
    return versionListCache.versions;
  }
  const versions = listStableVersions(releaseTags(await fetchReleasesFrom(1)));
  versionListCache = { versions, fetchedAt: Date.now() };
  return versions;
}

// Always queries GitHub so a check never misses a release published while the app was open
async function resolveTargetTag(settings: UpdateSettings): Promise<string> {
  if (settings.pinnedVersion !== undefined) {
    const tag = tagForVersion(settings.pinnedVersion);
    if (!(await releaseExists(tag))) {
      throw new Error(`Version ${settings.pinnedVersion} was not found`);
    }
    return tag;
  }
  const tag = selectChannelTag(releaseTags(await fetchReleasesPage(1)), settings.channel);
  if (tag === undefined) {
    throw new Error(`No release found for channel ${settings.channel}`);
  }
  return tag;
}

export { RELEASES_DOWNLOAD_URL, listVersions, resolveTargetTag };
