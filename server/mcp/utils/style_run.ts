// Local imports
import {
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleRequest,
  attributeCall,
  givenProperties,
  mergeCalls,
  styleCalls,
} from "@vease_server/mcp/utils/style_plan";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";
import { distinctHexColors } from "@vease_server/mcp/utils/distinct_colors";

interface FailedData {
  id: string;
  error: string;
}

const ATTRIBUTE_OPTIONS = [
  "location",
  "item",
  "colormap",
  "minimum",
  "maximum",
  "timeStep",
  "noDataColor",
] as const;

// Whatever does not depend on the data styled is checked before reading any of them
function requestError(ids: string[], request: StyleRequest): string | undefined {
  if (request.componentIds !== undefined && ids.length > 1) {
    return "componentIds belong to one model: give a single id with them";
  }
  const properties = givenProperties(request);
  if (request.attribute !== undefined) {
    return properties.length > 0
      ? `attribute cannot be combined with ${properties.join(", ")}; style in a separate call`
      : undefined;
  }
  const stray = ATTRIBUTE_OPTIONS.filter((option) => request[option] !== undefined);
  if (stray.length > 0) {
    return `${stray.join(", ")}: only for coloring by an attribute`;
  }
  if (properties.length === 0) {
    return "Nothing to change: give visibility, color, size, width, coloring or attribute";
  }
  if (request.coloring === "random" && request.color !== undefined) {
    return 'Give either a color or coloring "random", not both';
  }
  return undefined;
}

function isStyleDetails(value: unknown): value is StyleDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "viewer_type" in value &&
    "targets" in value &&
    Array.isArray(value.targets) &&
    "attributes" in value &&
    Array.isArray(value.attributes)
  );
}

async function readDetails(id: string): Promise<StyleDetails> {
  const result = await callControllerApi(
    `/api/controller/data/details?id=${encodeURIComponent(id)}`,
    { method: "GET", errorPrefix: "Cannot read the data" },
  );
  if (!result.ok) {
    throw new StylePlanError(result.message);
  }
  const details = controllerResponse(result.payload);
  if (!isStyleDetails(details)) {
    throw new StylePlanError("Unexpected data details");
  }
  return details;
}

function planCalls(details: StyleDetails, request: StyleRequest, randomColor: string): RouteCall[] {
  const { attribute } = request;
  if (attribute === undefined) {
    return styleCalls(details, request, randomColor);
  }
  return [attributeCall(details, { ...request, attribute })];
}

function reasonMessage(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message;
  }
  return String(reason);
}

// Every data is planned on its own: one that cannot be styled does not stop the others
async function planAll(
  ids: string[],
  request: StyleRequest,
): Promise<{ calls: RouteCall[]; failed: FailedData[] }> {
  const randomColors = distinctHexColors(ids.length);
  const planned = await Promise.allSettled(
    ids.map(async (id, index) => {
      const details = await readDetails(id);
      return planCalls(details, request, randomColors[index] ?? "#ffffff");
    }),
  );
  const calls: RouteCall[] = [];
  const failed: FailedData[] = [];
  for (const [index, outcome] of planned.entries()) {
    if (outcome.status === "fulfilled") {
      calls.push(...outcome.value);
    } else {
      failed.push({ id: ids[index] ?? "", error: reasonMessage(outcome.reason) });
    }
  }
  return { calls: mergeCalls(calls), failed };
}

function isRouteResponse(
  value: unknown,
): value is { failed?: FailedData[]; attributes?: unknown[] } {
  return typeof value === "object" && value !== null;
}

// Route calls run one after the other: the browser applies its commands in order anyway
async function runCalls(
  calls: RouteCall[],
): Promise<{ failed: FailedData[]; attributes: unknown[] }> {
  const failed: FailedData[] = [];
  const attributes: unknown[] = [];
  for (const { route, ids, params } of calls) {
    // oxlint-disable-next-line no-await-in-loop -- the calls must not be reordered
    const result = await callControllerApi(route, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, ...params }),
      errorPrefix: route.replace("/api/controller/", ""),
    });
    if (result.ok) {
      const response = controllerResponse(result.payload);
      if (isRouteResponse(response)) {
        failed.push(...(response.failed ?? []));
        attributes.push(...(response.attributes ?? []));
      }
    } else {
      failed.push(...ids.map((id) => ({ id, error: result.message })));
    }
  }
  return { failed, attributes };
}

function uniqueErrors(failed: FailedData[]): string {
  return [...new Set(failed.map(({ error }) => error))].join("; ");
}

async function runStyle(ids: string[], request: StyleRequest): Promise<string> {
  const invalid = requestError(ids, request);
  if (invalid !== undefined) {
    return `Error setting style: ${invalid}`;
  }
  const planned = await planAll(ids, request);
  const ran = await runCalls(planned.calls);
  const failed = [...planned.failed, ...ran.failed];
  const failedIds = new Set(failed.map(({ id }) => id));
  const styled = ids.filter((id) => !failedIds.has(id));
  if (styled.length === 0) {
    return `Error setting style: ${uniqueErrors(failed)}`;
  }
  const response: Record<string, unknown> = { ids: styled };
  if (request.attribute === undefined) {
    response.applied = givenProperties(request);
  } else {
    response.attributes = ran.attributes;
  }
  if (failed.length > 0) {
    response.failed = failed;
  }
  return `Style updated: ${JSON.stringify(response)}`;
}

export { runStyle };
