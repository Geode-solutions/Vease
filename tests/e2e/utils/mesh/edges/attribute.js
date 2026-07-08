import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshEdgesVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Edges",
    "Vertex attribute",
    attributeName,
    options,
  );
}

function setMeshEdgesEdgeAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Edges",
    "Edge attribute",
    attributeName,
    options,
  );
}

export { setMeshEdgesVertexAttribute, setMeshEdgesEdgeAttribute };
