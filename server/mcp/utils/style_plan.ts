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

const TEXTURED_ELEMENTS = new Set(["cells", "polygons"]);
const MODEL_COMPONENTS = ["corners", "lines", "surfaces", "blocks"];
// Without target, an attribute is searched from the highest-dimension target down
const TARGET_PRIORITY = [
  "polyhedra",
  "cells",
  "polygons",
  "edges",
  "points",
  "blocks",
  "surfaces",
  "lines",
  "corners",
];
// An element attribute comes before the vertex attribute of the same name
const LOCATION_PRIORITY = ["edge", "cell", "polygon", "polyhedron", "vertex"];

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

// A mesh has no random coloring of its own: random gives it the color drawn for it
function colorCall(
  route: string,
  details: StyleDetails,
  request: StyleRequest,
  randomColor: string,
): RouteCall[] {
  if (request.coloring === "random") {
    return [call(`${route}/color`, details, { color: randomColor })];
  }
  if (request.color === undefined) {
    return [];
  }
  return [call(`${route}/color`, details, { color: request.color })];
}

function visibilityCall(route: string, details: StyleDetails, request: StyleRequest): RouteCall[] {
  if (request.visibility === undefined) {
    return [];
  }
  return [call(`${route}/visibility`, details, { visibility: request.visibility })];
}

function checkMeshElement(details: StyleDetails, request: StyleRequest, element: string): void {
  checkTarget(details, element);
  const supported: StyleProperty[] = ["visibility", "color", "coloring"];
  if (element === "points") {
    supported.push("size");
  }
  if (element === "edges") {
    supported.push("width");
  }
  rejectProperties(request, supported, `mesh ${element}`);
  if (request.coloring === "textures" && !TEXTURED_ELEMENTS.has(element)) {
    throw new StylePlanError(`coloring "textures" cannot be set on mesh ${element}`);
  }
  if (
    request.coloring === "constant" &&
    !TEXTURED_ELEMENTS.has(element) &&
    request.color === undefined
  ) {
    throw new StylePlanError(`Give a color to set a constant coloring on mesh ${element}`);
  }
}

function meshElementCalls(
  details: StyleDetails,
  request: StyleRequest,
  element: string,
  randomColor: string,
): RouteCall[] {
  checkMeshElement(details, request, element);
  const route = `mesh/${element}`;
  const { size, width, coloring } = request;
  const calls = [
    ...visibilityCall(route, details, request),
    ...colorCall(route, details, request, randomColor),
  ];
  if (size !== undefined) {
    calls.push(call(`${route}/size`, details, { size }));
  }
  if (width !== undefined) {
    calls.push(call(`${route}/width`, details, { width }));
  }
  // Only cells and polygons have a coloring of their own to switch, between constant and textures
  if (TEXTURED_ELEMENTS.has(element) && (coloring === "constant" || coloring === "textures")) {
    calls.push(call(`${route}/coloring`, details, { coloring }));
  }
  return calls;
}

function meshCalls(details: StyleDetails, request: StyleRequest, randomColor: string): RouteCall[] {
  if (request.componentIds !== undefined) {
    throw new StylePlanError("componentIds only applies to model corners, lines, surfaces, blocks");
  }
  if (request.target !== undefined) {
    return meshElementCalls(details, request, request.target, randomColor);
  }
  // Random on a whole mesh is a color drawn for it, so it stands for the color
  const colorProperty = request.coloring === "random" ? "coloring" : "color";
  rejectProperties(request, ["visibility", colorProperty], `the whole mesh "${details.name}"`);
  return [
    ...visibilityCall("mesh", details, request),
    ...colorCall("mesh", details, request, randomColor),
  ];
}

function modelComponentCalls(
  details: StyleDetails,
  request: StyleRequest,
  component: string,
): RouteCall[] {
  checkTarget(details, component);
  rejectProperties(request, ["visibility", "color", "coloring"], `model ${component}`);
  const { componentIds, visibility, color, coloring } = request;
  if (coloring === "textures") {
    throw new StylePlanError(`coloring "textures" cannot be set on model ${component}`);
  }
  const route = `model/${component}`;
  const calls: RouteCall[] = [];
  if (visibility !== undefined) {
    calls.push(call(`${route}/visibility`, details, { componentIds, visibility }));
  }
  if (color !== undefined) {
    calls.push(call(`${route}/color`, details, { componentIds, color }));
  }
  if (coloring !== undefined) {
    calls.push(call(`${route}/coloring`, details, { componentIds, coloring }));
  }
  return calls;
}

function modelCalls(details: StyleDetails, request: StyleRequest): RouteCall[] {
  const { target } = request;
  if (target !== undefined && MODEL_COMPONENTS.includes(target)) {
    return modelComponentCalls(details, request, target);
  }
  if (request.componentIds !== undefined) {
    throw new StylePlanError(
      `componentIds only applies to model corners, lines, surfaces, blocks, not ${target ?? "the whole model"}`,
    );
  }
  if (target === undefined) {
    if (request.visibility === undefined || givenProperties(request).length > 1) {
      throw new StylePlanError(
        "Give a target to style a model: points, edges, corners, lines, surfaces or blocks",
      );
    }
    return visibilityCall("model", details, request);
  }
  if (target !== "points" && target !== "edges") {
    throw new StylePlanError(
      `"${target}" is not a model target; use points, edges, ${MODEL_COMPONENTS.join(", ")}`,
    );
  }
  const supported: StyleProperty[] = ["visibility"];
  if (target === "points") {
    supported.push("size");
  }
  rejectProperties(request, supported, `model ${target}`);
  const calls = visibilityCall(`model/${target}`, details, request);
  if (request.size !== undefined) {
    calls.push(call(`model/${target}/size`, details, { size: request.size }));
  }
  return calls;
}

function styleCalls(
  details: StyleDetails,
  request: StyleRequest,
  randomColor: string,
): RouteCall[] {
  if (details.viewer_type === "model") {
    return modelCalls(details, request);
  }
  return meshCalls(details, request, randomColor);
}

function priority(order: string[], value: string): number {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
}

function availableAttributes(details: StyleDetails): string {
  const groups = new Map<string, Set<string>>();
  for (const { target, location, name } of details.attributes) {
    const key = `${target}/${location}`;
    groups.set(key, (groups.get(key) ?? new Set()).add(name));
  }
  const listed = [...groups].map(([key, names]) => `${key}: ${[...names].join(", ")}`);
  return listed.join("; ") || "none";
}

function attributeCall(
  details: StyleDetails,
  request: StyleRequest & { attribute: string },
): RouteCall {
  const { target, location, componentIds, attribute } = request;
  const onModel = details.viewer_type === "model";
  if (componentIds !== undefined && (!onModel || target === undefined)) {
    throw new StylePlanError(
      onModel
        ? "componentIds needs a target: corners, lines, surfaces or blocks"
        : "componentIds only applies to model corners, lines, surfaces, blocks",
    );
  }
  if (target !== undefined) {
    checkTarget(details, target);
  }
  if (onModel && target !== undefined && !MODEL_COMPONENTS.includes(target)) {
    throw new StylePlanError(
      `Model ${target} carry no attributes; color corners, lines, surfaces or blocks`,
    );
  }
  const [found] = details.attributes
    .filter(
      (candidate) =>
        candidate.name === attribute &&
        (target === undefined || candidate.target === target) &&
        (location === undefined || candidate.location === location),
    )
    .toSorted(
      (first, second) =>
        priority(TARGET_PRIORITY, first.target) - priority(TARGET_PRIORITY, second.target) ||
        priority(LOCATION_PRIORITY, first.location) - priority(LOCATION_PRIORITY, second.location),
    );
  if (found === undefined) {
    throw new StylePlanError(
      `Attribute "${attribute}" not found on "${details.name}". Available: ${availableAttributes(details)}`,
    );
  }
  const { item, colormap, minimum, maximum, timeStep, noDataColor } = request;
  return call(
    `${onModel ? "model" : "mesh"}/${found.target}/${found.location}/attribute`,
    details,
    {
      componentIds,
      name: attribute,
      item,
      colormap,
      minimum,
      maximum,
      timeStep,
      noDataColor,
    },
  );
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
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleRequest,
  attributeCall,
  givenProperties,
  mergeCalls,
  styleCalls,
};
