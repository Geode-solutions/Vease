import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPolyhedraVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polyhedra",
    "Vertex attribute",
    attributeName,
    options,
  );
}

function setMeshPolyhedraPolyhedronAttribute(
  window,
  viewerObjectType,
  attributeName,
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polyhedra",
    "Polyhedron attribute",
    attributeName,
    options,
  );
}

export { setMeshPolyhedraVertexAttribute, setMeshPolyhedraPolyhedronAttribute };
