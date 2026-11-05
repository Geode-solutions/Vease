// Local imports
import {
  MODEL_COMPONENTS,
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleProperty,
  type StyleRequest,
  call,
  checkTarget,
  givenProperties,
  rejectProperties,
} from "@vease_server/mcp/utils/style_plan_common";

const TEXTURED_ELEMENTS = new Set(["cells", "polygons"]);

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

export { styleCalls };
