// Viewer Object Types
const meshViewerObjectType = "mesh";
const modelViewerObjectType = "model";

// Geode Object Types
const pointSetGeodeObjectType = "PointSet3D";
const edgedCurveGeodeObjectType = "EdgedCurve3D";
const rgd2dGeodeObjectType = "RegularGrid2D";
const rgd3dGeodeObjectType = "RegularGrid3D";
const polygonalSurfaceGeodeObjectType = "PolygonalSurface3D";
const hybridSolidGeodeObjectType = "HybridSolid3D";
const tetrahedralSolidGeodeObjectType = "TetrahedralSolid3D";
const triangulatedSurfaceGeodeObjectType = "TriangulatedSurface3D";
const brepGeodeObjectType = "BRep";

// Attribute Names
const edgedCurveAttributeName = "edges";
const rgd2dAttributeName = "RGB_data";
const rgd3dAttributeName = "int_attribute";
const polygonalSurfaceAttributeName = "test_attribute";
const hybridSolidAttributeName = "test_attribute";
const tetrahedralSolidAttributeName = "tetrahedron_adjacents";
const triangulatedSurfaceAttributeName = "triangle_adjacents";

// Default Data Name
const defaultDataName = "test";

// Feature Names
const cellsFeatureName = "Cells";
const edgesFeatureName = "Edges";
const pointsFeatureName = "Points";
const polygonsFeatureName = "Polygons";
const polyhedraFeatureName = "Polyhedra";

// Attribute Types
const vertexAttributeType = "Vertex attribute";
const edgeAttributeType = "Edge attribute";
const polygonAttributeType = "Polygon attribute";
const polyhedronAttributeType = "Polyhedron attribute";
const cellAttributeType = "Cell attribute";

export {
  meshViewerObjectType,
  modelViewerObjectType,
  pointSetGeodeObjectType,
  edgedCurveGeodeObjectType,
  rgd2dGeodeObjectType,
  rgd3dGeodeObjectType,
  polygonalSurfaceGeodeObjectType,
  hybridSolidGeodeObjectType,
  tetrahedralSolidGeodeObjectType,
  triangulatedSurfaceGeodeObjectType,
  brepGeodeObjectType,
  edgedCurveAttributeName,
  rgd2dAttributeName,
  rgd3dAttributeName,
  polygonalSurfaceAttributeName,
  hybridSolidAttributeName,
  tetrahedralSolidAttributeName,
  triangulatedSurfaceAttributeName,
  defaultDataName,
  cellsFeatureName,
  edgesFeatureName,
  pointsFeatureName,
  polygonsFeatureName,
  polyhedraFeatureName,
  vertexAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  cellAttributeType,
};
