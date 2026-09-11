// Node imports

// Third party imports
import { isWindows } from "std-env";

const MILLISECONDS = 1000;

const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 25;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 25;
const WINDOWS_WAIT_DESKTOP = 30;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const beforeAllTimeout = 180_000;
const afterActionWait = 1500;
const modalTransitionWait = 2000;
const staggerMaxWait = 2000;
const defaultTimeout = 60_000;
const treeWaitTimeout = 60_000;
const randomMultiplier = 1000;

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;

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
const structuralModelGeodeObjectType = "StructuralModel";

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
  PAGE_HEIGHT,
  PAGE_WIDTH,
  WAIT_TIMES,
  afterActionWait,
  beforeAllTimeout,
  brepGeodeObjectType,
  cellAttributeType,
  cellsFeatureName,
  defaultDataName,
  defaultTimeout,
  edgeAttributeType,
  edgedCurveGeodeObjectType,
  edgesFeatureName,
  hybridSolidGeodeObjectType,
  meshViewerObjectType,
  modalTransitionWait,
  modelViewerObjectType,
  pointSetGeodeObjectType,
  pointsFeatureName,
  polygonAttributeType,
  polygonalSurfaceGeodeObjectType,
  polygonsFeatureName,
  polyhedraFeatureName,
  polyhedronAttributeType,
  randomMultiplier,
  rgd2dGeodeObjectType,
  rgd3dGeodeObjectType,
  staggerMaxWait,
  structuralModelGeodeObjectType,
  tetrahedralSolidGeodeObjectType,
  treeWaitTimeout,
  triangulatedSurfaceGeodeObjectType,
  vertexAttributeType,
};
