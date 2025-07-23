// Global variables

const points_defaultVisibility = true;
const edges_defaultVisibility = true;
const polygons_defaultVisibility = true;
const polyhedra_defaultVisibility = true;
const points_defaultSize = 10;
const points_defaultColor = { r: 20, g: 20, b: 20 };
const edges_defaultSize = 5;
const edges_defaultColor = { r: 20, g: 20, b: 20 };
const polygons_defaultColor = { r: 255, g: 255, b: 255 };
const polyhedra_defaultColor = { r: 255, g: 255, b: 255 };

const corners_defaultVisibility = true;
const lines_defaultVisibility = true;
const surfaces_defaultVisibility = true;
const blocks_defaultVisibility = true;
const lines_defaultColor = { r: 20, g: 20, b: 20 };

// Mesh functions
const meshPointsDefaultStyle = (
  visibility = points_defaultVisibility,
  size = points_defaultSize,
  color = points_defaultColor
) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color,
      vertex: null,
    },
    size,
  };
};

const meshEdgesDefaultStyle = (
  visibility = edges_defaultVisibility,
  size = edges_defaultSize,
  color = edges_defaultColor
) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color,
    },
    size,
  };
};

const meshPolygonsDefaultStyle = (
  visibility = polygons_defaultVisibility,
  color = polygons_defaultColor
) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color,
      textures: null,
      polygon: null,
      vertex: null,
    },
  };
};

const meshPolyhedraDefaultStyle = (
  visibility = polyhedra_defaultVisibility,
  color = polyhedra_defaultColor
) => {
  return {
    visibility,
    coloring: {
      active: "color",
      color,
      polyhedron: null,
      vertex: null,
    },
  };
};

const pointSet_defaultStyle = () => {
  return {
    visibility: true,
    points: meshPointsDefaultStyle(),
  };
};

const edgedCurve_defaultStyle = () => {
  return {
    visibility: true,
    points: meshPointsDefaultStyle(false),
    edges: meshEdgesDefaultStyle(),
  };
};

const surface_defaultStyle = (visibility = true) => {
  return {
    visibility,
    points: meshPointsDefaultStyle(false),
    edges: meshEdgesDefaultStyle(false),
    polygons: meshPolygonsDefaultStyle(),
  };
};

const solid_defaultStyle = () => {
  return {
    visibility: true,
    points: meshPointsDefaultStyle(false),
    edges: meshEdgesDefaultStyle(false),
    polygons: meshPolygonsDefaultStyle(),
    polyhedra: meshPolyhedraDefaultStyle(),
  };
};

// Model functions
const modelCornersDefaultStyle = (visibility = corners_defaultVisibility) => {
  return { visibility };
};
const modelLinesDefaultStyle = (
  visibility = lines_defaultVisibility,
  color = lines_defaultColor
) => {
  return { visibility, color };
};
const modelSurfacesDefaultStyle = (visibility = surfaces_defaultVisibility) => {
  return { visibility };
};
const modelBlocksDefaultStyle = (visibility = blocks_defaultVisibility) => {
  return { visibility };
};
const modelPointsDefaultStyle = (
  visibility = points_defaultVisibility,
  size
) => {
  return { visibility, size };
};
const modelEdgesDefaultStyle = (visibility = edges_defaultVisibility) => {
  return { visibility };
};

const brep_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    blocks: modelBlocksDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const crossSection_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const structuralModel_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    blocks: modelBlocksDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const section_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const implicitCrossSection_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const implicitStructuralModel_defaultStyle = () => {
  return {
    visibility: true,
    corners: modelCornersDefaultStyle(),
    lines: modelLinesDefaultStyle(),
    surfaces: modelSurfacesDefaultStyle(),
    blocks: modelBlocksDefaultStyle(),
    points: modelPointsDefaultStyle(false, points_defaultSize),
    edges: modelEdgesDefaultStyle(false, edges_defaultSize),
  };
};

const default_styles = () => {
  return {
    BRep: brep_defaultStyle(),
    CrossSection: crossSection_defaultStyle(),
    EdgedCurve2D: edgedCurve_defaultStyle(),
    EdgedCurve3D: edgedCurve_defaultStyle(),
    Graph: {},
    HybridSolid3D: solid_defaultStyle(),
    ImplicitCrossSection: implicitCrossSection_defaultStyle(),
    ImplicitStructuralModel: implicitStructuralModel_defaultStyle(),
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
    Section: section_defaultStyle(),
    StructuralModel: structuralModel_defaultStyle(),
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
