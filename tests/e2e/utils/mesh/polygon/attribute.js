import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPolygonsVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polygons",
    "Vertex attribute",
    attributeName,
    options,
  );
}

function setMeshPolygonsPolygonAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polygons",
    "Polygon attribute",
    attributeName,
    options,
  );
}

export { setMeshPolygonsVertexAttribute, setMeshPolygonsPolygonAttribute };
