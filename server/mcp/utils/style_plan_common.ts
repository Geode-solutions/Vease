// What vease://data/{id} tells about a data, as far as styling goes
interface StyleDetails {
  id: string;
  name: string;
  viewer_type: string;
  targets: string[];
  attributes: { target: string; location: string; name: string }[];
}

interface StyleRequest {
  target?: string;
  componentIds?: string[];
  visibility?: boolean;
  color?: string;
  size?: number;
  width?: number;
  coloring?: "constant" | "random" | "textures";
  attribute?: string;
  location?: string;
  item?: number;
  colormap?: string;
  minimum?: number;
  maximum?: number;
  timeStep?: number;
  noDataColor?: string;
}

// One controller route call, for the data in ids
interface RouteCall {
  route: string;
  ids: string[];
  params: Record<string, unknown>;
}

const STYLE_PROPERTIES = ["visibility", "color", "size", "width", "coloring"] as const;

type StyleProperty = (typeof STYLE_PROPERTIES)[number];

const MODEL_COMPONENTS = ["corners", "lines", "surfaces", "blocks"];

// A data the request cannot style: reported for that data, the others are still styled
class StylePlanError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "StylePlanError";
  }
}

function givenProperties(request: StyleRequest): StyleProperty[] {
  return STYLE_PROPERTIES.filter((property) => request[property] !== undefined);
}

function rejectProperties(
  request: StyleRequest,
  supported: readonly StyleProperty[],
  scope: string,
): void {
  const unsupported = givenProperties(request).filter((property) => !supported.includes(property));
  if (unsupported.length > 0) {
    throw new StylePlanError(`${unsupported.join(", ")} cannot be set on ${scope}`);
  }
}

function checkTarget(details: StyleDetails, target: string): void {
  if (!details.targets.includes(target)) {
    throw new StylePlanError(
      `"${target}" is not available on "${details.name}"; available: ${details.targets.join(", ")}`,
    );
  }
}

function call(route: string, details: StyleDetails, params: Record<string, unknown>): RouteCall {
  return { route: `/api/controller/style/${route}`, ids: [details.id], params };
}

// The same change on several data goes in one route call, so the viewer renders once
function mergeCalls(calls: RouteCall[]): RouteCall[] {
  const merged = new Map<string, RouteCall>();
  for (const routeCall of calls) {
    const key = `${routeCall.route} ${JSON.stringify(routeCall.params)}`;
    const existing = merged.get(key);
    if (existing === undefined) {
      merged.set(key, { ...routeCall, ids: [...routeCall.ids] });
    } else {
      existing.ids.push(...routeCall.ids);
    }
  }
  return [...merged.values()];
}

export {
  MODEL_COMPONENTS,
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleProperty,
  type StyleRequest,
  call,
  checkTarget,
  givenProperties,
  mergeCalls,
  rejectProperties,
};
