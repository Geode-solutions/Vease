// PointSet components
import PointSetPointsOptions from "@vease/components/Viewer/PointSet/PointsOptions.vue";

// EdgedCurve components
import EdgedCurvePointsOptions from "@vease/components/Viewer/EdgedCurve/PointsOptions.vue";
import EdgedCurveEdgesOptions from "@vease/components/Viewer/EdgedCurve/EdgesOptions.vue";

// PolygonalSurface components
import PolygonalSurfacePointsOptions from "@vease/components/Viewer/PolygonalSurface/PointsOptions.vue";
import PolygonalSurfaceEdgesOptions from "@vease/components/Viewer/PolygonalSurface/EdgesOptions.vue";
import PolygonalSurfacePolygonsOptions from "@vease/components/Viewer/PolygonalSurface/PolygonsOptions.vue";

// TriangulatedSurface components
import TriangulatedSurfacePointsOptions from "@vease/components/Viewer/TriangulatedSurface/PointsOptions.vue";
import TriangulatedSurfaceEdgesOptions from "@vease/components/Viewer/TriangulatedSurface/EdgesOptions.vue";
import TriangulatedSurfaceTrianglesOptions from "@vease/components/Viewer/TriangulatedSurface/TrianglesOptions.vue";

// Grid 2D components
import Grid2DPointsOptions from "@vease/components/Viewer/Grid/2D/PointsOptions.vue";
import Grid2DEdgesOptions from "@vease/components/Viewer/Grid/2D/EdgesOptions.vue";
import Grid2DCellsOptions from "@vease/components/Viewer/Grid/2D/CellsOptions.vue";

// Grid 3D components
import Grid3DPointsOptions from "@vease/components/Viewer/Grid/3D/PointsOptions.vue";
import Grid3DEdgesOptions from "@vease/components/Viewer/Grid/3D/EdgesOptions.vue";
import Grid3DFacetsOptions from "@vease/components/Viewer/Grid/3D/FacetsOptions.vue";
import Grid3DCellsOptions from "@vease/components/Viewer/Grid/3D/CellsOptions.vue";

// Solid components
import SolidPointsOptions from "@vease/components/Viewer/Solid/PointsOptions.vue";
import SolidEdgesOptions from "@vease/components/Viewer/Solid/EdgesOptions.vue";
import SolidPolygonsOptions from "@vease/components/Viewer/Solid/PolygonsOptions.vue";
import SolidPolyhedraOptions from "@vease/components/Viewer/Solid/PolyhedraOptions.vue";

// TetrahedralSolid components
import TetrahedralSolidTrianglesOptions from "@vease/components/Viewer/TetrahedralSolid/TrianglesOptions.vue";
import TetrahedralSolidTetrahedraOptions from "@vease/components/Viewer/TetrahedralSolid/TetrahedraOptions.vue";

// Model components
import ModelEdgesOptions from "@vease/components/Viewer/Generic/Model/EdgesOptions.vue";
import ModelPointsOptions from "@vease/components/Viewer/Generic/Model/PointsOptions.vue";

const PointSet_menu = [PointSetPointsOptions];

const EdgedCurve_menu = [EdgedCurvePointsOptions, EdgedCurveEdgesOptions];

const PolygonalSurface_menu = [
  PolygonalSurfacePointsOptions,
  PolygonalSurfaceEdgesOptions,
  PolygonalSurfacePolygonsOptions,
];

const TriangulatedSurface_menu = [
  TriangulatedSurfacePointsOptions,
  TriangulatedSurfaceEdgesOptions,
  TriangulatedSurfaceTrianglesOptions,
];

const Grid2D_menu = [
  Grid2DPointsOptions,
  Grid2DEdgesOptions,
  Grid2DCellsOptions,
];
const Grid3D_menu = [
  Grid3DPointsOptions,
  Grid3DEdgesOptions,
  Grid3DFacetsOptions,
  Grid3DCellsOptions,
];

const Solid_menu = [
  SolidPointsOptions,
  SolidEdgesOptions,
  SolidPolygonsOptions,
  SolidPolyhedraOptions,
];

const TetrahedralSolid_menu = [
  SolidPointsOptions,
  SolidEdgesOptions,
  TetrahedralSolidTrianglesOptions,
  TetrahedralSolidTetrahedraOptions,
];

const BRep_menu = [ModelEdgesOptions, ModelPointsOptions];

const CrossSection_menu = [ModelEdgesOptions, ModelPointsOptions];

const ImplicitCrossSection_menu = [ModelEdgesOptions, ModelPointsOptions];
const ImplicitStructuralModel_menu = [ModelEdgesOptions, ModelPointsOptions];

const Section_menu = [ModelEdgesOptions, ModelPointsOptions];

const StructuralModel_menu = [ModelEdgesOptions, ModelPointsOptions];

const menusData = {
  mesh: {
    EdgedCurve2D: EdgedCurve_menu,
    EdgedCurve3D: EdgedCurve_menu,
    HybridSolid3D: Solid_menu,
    LightRegularGrid2D: Grid2D_menu,
    LightRegularGrid3D: Grid3D_menu,
    PointSet2D: PointSet_menu,
    PointSet3D: PointSet_menu,
    PolygonalSurface2D: PolygonalSurface_menu,
    PolygonalSurface3D: PolygonalSurface_menu,
    PolyhedralSolid3D: Solid_menu,
    RegularGrid2D: Grid2D_menu,
    RegularGrid3D: Grid3D_menu,
    TetrahedralSolid3D: TetrahedralSolid_menu,
    TriangulatedSurface2D: TriangulatedSurface_menu,
    TriangulatedSurface3D: TriangulatedSurface_menu,
  },
  model: {
    BRep: BRep_menu,
    CrossSection: CrossSection_menu,
    ImplicitCrossSection: ImplicitCrossSection_menu,
    ImplicitStructuralModel: ImplicitStructuralModel_menu,
    Section: Section_menu,
    StructuralModel: StructuralModel_menu,
  },
};

export const useMenuStore = defineStore("menu", () => {
  const menus = ref(menusData);
  const display_menu = ref(false);
  const current_id = ref(null);
  const menuX = ref(0);
  const menuY = ref(0);
  const containerWidth = ref(window.innerWidth);
  const containerHeight = ref(window.innerHeight);

  function getMenuItems(objectType, geodeObject) {
    if (!objectType || !geodeObject || !menus.value[objectType]) {
      return [];
    }
    return menus.value[objectType][geodeObject] || [];
  }

  function closeMenu() {
    display_menu.value = false;
    current_id.value = null;
  }

  async function openMenu(id, x, y, containerWidth, containerHeight) {
    await closeMenu();
    current_id.value = id;

    if (x !== undefined && y !== undefined) {
      menuX.value = x;
      menuY.value = y;
    }

    if (containerWidth) containerWidth.value = containerWidth;
    if (containerHeight) containerHeight.value = containerHeight;

    display_menu.value = true;
  }

  function showItemsWithDelay() {
    const DELAY = 50;
    const items = getMenuItems();
    items.forEach((item, index) => {
      setTimeout(() => {
        item.visible = true;
      }, index * DELAY);
    });
  }

  return {
    display_menu,
    current_id,
    menuX,
    menuY,
    containerWidth,
    containerHeight,
    getMenuItems,
    closeMenu,
    openMenu,
    showItemsWithDelay,
  };
});
