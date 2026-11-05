// Local imports
import {
  MODEL_COMPONENTS,
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleRequest,
  call,
  checkTarget,
} from "@vease_server/mcp/utils/style_plan_common";

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

export { attributeCall };
