import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPointsVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Points",
    "Vertex attribute",
    attributeName,
    options,
  );
}

export { setMeshPointsVertexAttribute };
