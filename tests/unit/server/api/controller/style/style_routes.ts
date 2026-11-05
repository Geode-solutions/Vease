// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import type { H3Event } from "h3";

type RouteHandler = (event: H3Event) => Promise<unknown>;
type StyleBody = Record<string, unknown>;

interface InvalidBody {
  route: string;
  reason: string;
  body: StyleBody;
}

const DATA_ID = "0123456789abcdef0123456789abcdef";
const OTHER_ID = "fedcba9876543210fedcba9876543210";
const STYLE_ROUTES_DIR = path.resolve(
  import.meta.dirname,
  "../../../../../../server/api/controller/style",
);
const POST_SUFFIX = /\.post\.ts$/u;

// The style routes of a viewer type found on disk, so a route added without a test is noticed
function styleRoutesOnDisk(
  viewerType: "mesh" | "model",
  { attribute }: { attribute: boolean },
): string[] {
  return fs
    .globSync(`${viewerType}/**/*.post.ts`, { cwd: STYLE_ROUTES_DIR })
    // Windows globs with backslashes, while routes are written with slashes
    .map((file) => file.replaceAll(path.sep, path.posix.sep).replace(POST_SUFFIX, ""))
    .filter((route) => route.endsWith("/attribute") === attribute)
    .toSorted();
}

function isRouteHandler(value: unknown): value is RouteHandler {
  return typeof value === "function";
}

// Imported by path, so the tables list routes instead of 48 imports. A plain specifier keeps
// Vite's dynamic-import-vars, which only resolves one directory level, out of the way
async function loadStyleRoute(route: string): Promise<RouteHandler> {
  const specifier = path.join(STYLE_ROUTES_DIR, `${route}.post.ts`);
  const routeModule: unknown = await import(specifier);
  if (
    typeof routeModule !== "object" ||
    routeModule === null ||
    !("default" in routeModule) ||
    !isRouteHandler(routeModule.default)
  ) {
    throw new Error(`style/${route} has no default handler`);
  }
  return routeModule.default;
}

// Bodies every style route rejects, whatever its value: no ids, bad ids, no value, a stray key
function commonInvalidBodies(route: string, valueBody: StyleBody): InvalidBody[] {
  return [
    { route, reason: "an empty ids list", body: { ...valueBody, ids: [] } },
    { route, reason: "no ids", body: valueBody },
    { route, reason: "a short id", body: { ...valueBody, ids: ["short"] } },
    { route, reason: "no value", body: { ids: [DATA_ID] } },
    { route, reason: "a stray target", body: { ids: [DATA_ID], ...valueBody, target: "points" } },
  ];
}

export {
  DATA_ID,
  type InvalidBody,
  OTHER_ID,
  type StyleBody,
  commonInvalidBodies,
  loadStyleRoute,
  styleRoutesOnDisk,
};
