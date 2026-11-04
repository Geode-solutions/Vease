// Third party imports
import type { Mock } from "vitest";

// Local imports
import { controllerUrl, jsonResponse } from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import type { StyleDetails } from "@vease_server/mcp/utils/style_plan";

interface IdsBody {
  ids: string[];
}

type RouteAnswer = (body: IdsBody) => Response;

interface RouteRequest {
  route: string;
  body: unknown;
}

const SURFACE_ID = "11111111111111111111111111111111";
const OTHER_SURFACE_ID = "22222222222222222222222222222222";
const THIRD_SURFACE_ID = "33333333333333333333333333333333";
const SOLID_ID = "44444444444444444444444444444444";
const MODEL_ID = "55555555555555555555555555555555";

// A polygonal surface: vertex attributes are listed for both its points and its polygons
function surfaceDetails(id: string = SURFACE_ID, name = "surface"): StyleDetails {
  return {
    id,
    name,
    viewer_type: "mesh",
    targets: ["points", "edges", "polygons"],
    attributes: [
      { target: "points", location: "vertex", name: "depth" },
      { target: "points", location: "vertex", name: "porosity" },
      { target: "polygons", location: "vertex", name: "depth" },
      { target: "polygons", location: "polygon", name: "depth" },
      { target: "polygons", location: "polygon", name: "region" },
    ],
  };
}

const SOLID: StyleDetails = {
  id: SOLID_ID,
  name: "solid",
  viewer_type: "mesh",
  targets: ["points", "edges", "polygons", "polyhedra"],
  attributes: [
    { target: "points", location: "vertex", name: "depth" },
    { target: "polyhedra", location: "vertex", name: "depth" },
    { target: "polyhedra", location: "polyhedron", name: "rock" },
  ],
};

const MODEL: StyleDetails = {
  id: MODEL_ID,
  name: "model",
  viewer_type: "model",
  targets: ["points", "edges", "corners", "lines", "surfaces", "blocks"],
  attributes: [
    { target: "lines", location: "edge", name: "length" },
    { target: "surfaces", location: "polygon", name: "depth" },
    { target: "blocks", location: "vertex", name: "depth" },
  ],
};

const DETAILS_PATH = "/api/controller/data/details";
const ROUTE_PREFIX = controllerUrl("");

function isIdsBody(value: unknown): value is IdsBody {
  return typeof value === "object" && value !== null && "ids" in value && Array.isArray(value.ids);
}

function requestUrl(input: Parameters<typeof fetch>[0]): URL {
  if (input instanceof Request) {
    return new URL(input.url);
  }
  return new URL(input.toString());
}

function parsedBody(init: RequestInit | undefined): unknown {
  if (typeof init?.body !== "string") {
    return undefined;
  }
  return JSON.parse(init.body);
}

function detailsAnswer(details: StyleDetails[], id: string | null): Response {
  const found = details.find((candidate) => candidate.id === id);
  if (found === undefined) {
    return jsonResponse({ description: `No data with id ${id ?? ""}` }, { failed: true });
  }
  return jsonResponse({ statusCode: 200, response: found });
}

function succeeded(body: IdsBody): Response {
  return jsonResponse({ statusCode: 200, response: { ids: body.ids } });
}

// Plays the controller routes: data details from the given ones, every style route succeeds
// Unless routes answers it otherwise
function fakeController(
  fetchMock: Mock<typeof fetch>,
  { details, routes = {} }: { details: StyleDetails[]; routes?: Record<string, RouteAnswer> },
): void {
  fetchMock.mockImplementation(async (input, init) => {
    await Promise.resolve();
    const url = requestUrl(input);
    if (url.pathname === DETAILS_PATH) {
      return detailsAnswer(details, url.searchParams.get("id"));
    }
    const body = parsedBody(init);
    if (!isIdsBody(body)) {
      throw new Error(`No ids sent to ${url.href}`);
    }
    const answer = routes[url.href.replace(ROUTE_PREFIX, "")] ?? succeeded;
    return answer(body);
  });
}

// The style route calls sent, in order, without the data details reads
function routeRequests(fetchMock: Mock<typeof fetch>): RouteRequest[] {
  return fetchMock.mock.calls
    .filter(([input]) => requestUrl(input).pathname !== DETAILS_PATH)
    .map(([input, init]) => ({
      route: requestUrl(input).href.replace(ROUTE_PREFIX, ""),
      body: parsedBody(init),
    }));
}

function detailsReads(fetchMock: Mock<typeof fetch>): string[] {
  return fetchMock.mock.calls
    .map(([input]) => requestUrl(input))
    .filter((url) => url.pathname === DETAILS_PATH)
    .map((url) => url.searchParams.get("id") ?? "");
}

export {
  MODEL,
  MODEL_ID,
  OTHER_SURFACE_ID,
  type RouteAnswer,
  SOLID,
  SOLID_ID,
  SURFACE_ID,
  THIRD_SURFACE_ID,
  detailsReads,
  fakeController,
  routeRequests,
  surfaceDetails,
};
