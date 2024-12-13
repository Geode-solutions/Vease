const pointsDefaultStyle = (visibility, size) => {
  return {
    visibility,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
      vertex: { name: "" },
    },
    size,
  };
};

const edgesDefaultStyle = (visibility, size) => {
  return {
    visibility,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
    },
    size,
  };
};

const trianglesDefaultStyle = (visibility) => {
  return {
    visibility,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
      polygon: { name: "" },
      vertex: { name: "" },
    },
  };
};

const pointSet_defaultStyle = {
  visibility: true,
  points: pointsDefaultStyle(true, 1),
};

const edgedCurve_defaultStyle = {
  visibility: true,
  points: pointsDefaultStyle(true, 1),
  edges: edgesDefaultStyle(true, 1),
};

const surface_defaultStyle = {
  visibility: true,
  points: pointsDefaultStyle(true, 1),
  edges: edgesDefaultStyle(true, 1),
  triangles: trianglesDefaultStyle(true),
};

const default_styles = {
  BRep: {},
  CrossSection: {},
  EdgedCurve2D: edgedCurve_defaultStyle,
  EdgedCurve3D: edgedCurve_defaultStyle,
  Graph: {},
  HybridSolid3D: {},
  ImplicitCrossSection: {},
  ImplicitStructuralModel: {},
  LightRegularGrid2D: {},
  LightRegularGrid3D: {},
  PointSet2D: pointSet_defaultStyle,
  PointSet3D: pointSet_defaultStyle,
  PolygonalSurface2D: surface_defaultStyle,
  PolygonalSurface3D: surface_defaultStyle,
  PolyhedralSolid3D: {},
  RasterImage2D: {},
  RasterImage3D: {},
  RegularGrid2D: {},
  RegularGrid3D: {},
  Section: {},
  StructuralModel: {},
  TetrahedralSolid3D: {},
  TriangulatedSurface2D: surface_defaultStyle,
  TriangulatedSurface3D: surface_defaultStyle,
  VertexSet: {},
};

const getDefaultStyle = (type) => {
  return default_styles[type];
};

export { getDefaultStyle };
