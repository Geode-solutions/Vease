// PointSet components
import PointSetPointsOptions from "@/components/Viewer/PointSet/PointsOptions.vue";

// EdgedCurve components
import EdgedCurvePointsOptions from "@/components/Viewer/EdgedCurve/PointsOptions.vue";
import EdgedCurveEdgesOptions from "@/components/Viewer/EdgedCurve/EdgesOptions.vue";

// PolygonalSurface components
import PolygonalSurfacePointsOptions from "@/components/Viewer/PolygonalSurface/PointsOptions.vue";
import PolygonalSurfaceEdgesOptions from "@/components/Viewer/PolygonalSurface/EdgesOptions.vue";
import PolygonalSurfacePolygonsOptions from "@/components/Viewer/PolygonalSurface/PolygonsOptions.vue";

// TriangulatedSurface components
import TriangulatedSurfacePointsOptions from "@/components/Viewer/TriangulatedSurface/PointsOptions.vue";
import TriangulatedSurfaceEdgesOptions from "@/components/Viewer/TriangulatedSurface/EdgesOptions.vue";
import TriangulatedSurfaceTrianglesOptions from "@/components/Viewer/TriangulatedSurface/TrianglesOptions.vue";

// Grid 2D components
import Grid2DPointsOptions from "@/components/Viewer/Grid/2D/PointsOptions.vue";
import Grid2DEdgesOptions from "@/components/Viewer/Grid/2D/EdgesOptions.vue";
import Grid2DCellsOptions from "@/components/Viewer/Grid/2D/CellsOptions.vue";

// Grid 3D components
import Grid3DPointsOptions from "@/components/Viewer/Grid/3D/PointsOptions.vue";
import Grid3DEdgesOptions from "@/components/Viewer/Grid/3D/EdgesOptions.vue";
import Grid3DFacetsOptions from "@/components/Viewer/Grid/3D/FacetsOptions.vue";
import Grid3DCellsOptions from "@/components/Viewer/Grid/3D/CellsOptions.vue";

// Solid components
import SolidPointsOptions from "@/components/Viewer/Solid/PointsOptions.vue";
import SolidEdgesOptions from "@/components/Viewer/Solid/EdgesOptions.vue";
import SolidPolygonsOptions from "@/components/Viewer/Solid/PolygonsOptions.vue";
import SolidPolyhedronsOptions from "@/components/Viewer/Solid/PolyhedronsOptions.vue";

// TetrahedralSolid components
import TetrahedralSolidTrianglesOptions from "@/components/Viewer/TetrahedralSolid/TrianglesOptions.vue";
import TetrahedralSolidTetrahedronsOptions from "@/components/Viewer/TetrahedralSolid/TetrahedronsOptions.vue";

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
  SolidPolyhedronsOptions,
];

const TetrahedralSolid_menu = [
  SolidPointsOptions,
  SolidEdgesOptions,
  TetrahedralSolidTrianglesOptions,
  TetrahedralSolidTetrahedronsOptions,
];

const menus = {
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
    BRep: [],
    CrossSection: [],
    ImplicitCrossSection: [],
    ImplicitStructuralModel: [],
    Section: [],
    StructuralModel: [],
  },
};

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menus,
    display_menu: false,
  }),
  getters: {
    getMenuItems: (state) => {
      return (object_type, geode_object) =>
        state.menus[object_type][geode_object];
    },
  },
  actions: {
    closeMenu() {
      this.display_menu = false;
    },
    async openMenu() {
      await this.closeMenu();
      this.display_menu = true;
    },
    showItemsWithDelay() {
      const DELAY = 50;
      this.items.forEach((item, index) => {
        setTimeout(() => {
          item.visible = true;
        }, index * DELAY);
      });
    },
  },
});
