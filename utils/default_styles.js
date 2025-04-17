const pointsDefaultStyle = (visibility, size) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color: { r: 255, g: 0, b: 0 },
      vertex: null,
    },
    size,
  };
};

const edgesDefaultStyle = (visibility, size) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color: { r: 0, g: 0, b: 0 },
    },
    size,
  };
};

const polygonsDefaultStyle = (visibility) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color: { r: 255, g: 255, b: 255 },
      textures: null,
      polygon: null,
      vertex: null,
    },
  };
};

const polyhedraDefaultStyle = (visibility) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color: { r: 255, g: 255, b: 255 },
      polyhedron: null,
      vertex: null,
    },
  };
};

const points_defaultSize = 10;
const edges_defaultSize = 5;

const pointSet_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(true, points_defaultSize),
  };
};

const edgedCurve_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(false, points_defaultSize),
    edges: edgesDefaultStyle(true, edges_defaultSize),
  };
};

const surface_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(false, points_defaultSize),
    edges: edgesDefaultStyle(false, edges_defaultSize),
    polygons: polygonsDefaultStyle(true),
  };
};

const solid_defaultStyle = () => {
  return {
    visibility: true,
    points: pointsDefaultStyle(false, points_defaultSize),
    edges: edgesDefaultStyle(false, edges_defaultSize),
    polygons: polygonsDefaultStyle(true),
    polyhedra: polyhedraDefaultStyle(true),
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

function getDefaultStyle(type) {
  return default_styles()[type];
}

export { getDefaultStyle };
