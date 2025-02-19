const pointsDefaultStyle = (visibility, size) => {
  return {
    visibility,
    color: {
      active: "constant",
      constant: { r: 255, g: 0, b: 0 },
      vertex: { name: "" },
    },
    size,
  };
};

const edgesDefaultStyle = (visibility, size) => {
  return {
    visibility,
    color: {
      active: "constant",
      constant: { r: 0, g: 0, b: 0 },
    },
    size,
  };
};

const polygonsDefaultStyle = (visibility) => {
  return {
    visibility,
    color: {
      active: "constant",
      constant: { r: 255, g: 255, b: 255 },
      polygon: { name: "" },
      vertex: { name: "" },
    },
  };
};

const polyhedronsDefaultStyle = (visibility) => {
  return {
    visibility,
    color: {
      active: "constant",
      constant: { r: 255, g: 255, b: 255 },
      polyhedron: { name: "" },
      vertex: { name: "" },
    },
  };
};

const pointSet_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(true, 10),
  };
};

const edgedCurve_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(true, 10),
    edges: edgesDefaultStyle(true, 5),
  };
};

const surface_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(false, 10),
    edges: edgesDefaultStyle(false, 1),
    polygons: polygonsDefaultStyle(true),
  };
};


const solid_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(false, 10),
    edges: edgesDefaultStyle(false, 1),
    polygons: polygonsDefaultStyle(true),
    polyhedrons: polyhedronsDefaultStyle(true)
  };
};

const default_styles = () => {
  return {
    BRep: {},
    CrossSection: {},
    EdgedCurve2D: edgedCurve_defaultStyle(),
    EdgedCurve3D: edgedCurve_defaultStyle(),
    Graph: {},
    HybridSolid3D: solid_defaultStyle(),
    ImplicitCrossSection: {},
    ImplicitStructuralModel: {},
    LightRegularGrid2D: surface_defaultStyle(),
    LightRegularGrid3D: solid_defaultStyle(),
    PointSet2D: pointSet_defaultStyle(),
    PointSet3D: pointSet_defaultStyle(),
    PolygonalSurface2D: surface_defaultStyle(),
    PolygonalSurface3D: surface_defaultStyle(),
    PolyhedralSolid3D: solid_defaultStyle(),
    RasterImage2D: {},
    RasterImage3D: {},
    RegularGrid2D: surface_defaultStyle(),
    RegularGrid3D: solid_defaultStyle(),
    Section: {},
    StructuralModel: {},
    TetrahedralSolid3D: solid_defaultStyle(),
    TriangulatedSurface2D: surface_defaultStyle(),
    TriangulatedSurface3D: surface_defaultStyle(),
    VertexSet: {},
  };
};

const getDefaultStyle = (type) => {
  return default_styles()[type];
};

export { getDefaultStyle };
