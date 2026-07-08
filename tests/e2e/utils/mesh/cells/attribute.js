import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshCellsVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Cells",
    "Vertex attribute",
    attributeName,
    options,
  );
}

function setMeshCellsCellAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Cells",
    "Cell attribute",
    attributeName,
    options,
  );
}

export { setMeshCellsCellAttribute, setMeshCellsVertexAttribute };
