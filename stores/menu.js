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

// RegularGrid components
import RegularGridPointsOptions from "@/components/Viewer/RegularGrid/PointsOptions.vue";
import RegularGridEdgesOptions from "@/components/Viewer/RegularGrid/EdgesOptions.vue";
import RegularGrid2DCellsOptions from "@/components/Viewer/RegularGrid/2D/CellsOptions.vue";
import RegularGrid3DFacetsOptions from "@/components/Viewer/RegularGrid/3D/FacetsOptions.vue";
import RegularGrid3DCellsOptions from "@/components/Viewer/RegularGrid/3D/CellsOptions.vue";

// HybridSolid components
import HybridSolidPointsOptions from "@/components/Viewer/HybridSolid/PointsOptions.vue";
import HybridSolidEdgesOptions from "@/components/Viewer/HybridSolid/EdgesOptions.vue";
import HybridSolidPolygonsOptions from "@/components/Viewer/HybridSolid/PolygonsOptions.vue";
import HybridSolidPolyhedronsOptions from "@/components/Viewer/HybridSolid/PolyhedronsOptions.vue";

// PolyhedralSolid components
import PolyhedralSolidPointsOptions from "@/components/Viewer/PolyhedralSolid/PointsOptions.vue";
import PolyhedralSolidEdgesOptions from "@/components/Viewer/PolyhedralSolid/EdgesOptions.vue";
import PolyhedralSolidPolygonsOptions from "@/components/Viewer/PolyhedralSolid/PolygonsOptions.vue";
import PolyhedralSolidPolyhedronsOptions from "@/components/Viewer/PolyhedralSolid/PolyhedronsOptions.vue";

// TetrahedralSolid components
import TetrahedralSolidPointsOptions from "@/components/Viewer/TetrahedralSolid/PointsOptions.vue";
import TetrahedralSolidEdgesOptions from "@/components/Viewer/TetrahedralSolid/EdgesOptions.vue";
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

const RegularGrid2D_menu = [
  RegularGridPointsOptions,
  RegularGridEdgesOptions,
  RegularGrid2DCellsOptions,
];
const RegularGrid3D_menu = [
  RegularGridPointsOptions,
  RegularGridEdgesOptions,
  RegularGrid3DFacetsOptions,
  RegularGrid3DCellsOptions,
];

const HybridSolid_menu = [
  HybridSolidPointsOptions,
  HybridSolidEdgesOptions,
  HybridSolidPolygonsOptions,
  HybridSolidPolyhedronsOptions,
];
const PolyhedralSolid_menu = [
  PolyhedralSolidPointsOptions,
  PolyhedralSolidEdgesOptions,
  PolyhedralSolidPolygonsOptions,
  PolyhedralSolidPolyhedronsOptions,
];

const TetrahedralSolid_menu = [
  TetrahedralSolidPointsOptions,
  TetrahedralSolidEdgesOptions,
  TetrahedralSolidTrianglesOptions,
  TetrahedralSolidTetrahedronsOptions,
];

const menus = {
  mesh: {
    EdgedCurve2D: EdgedCurve_menu,
    EdgedCurve3D: EdgedCurve_menu,
    HybridSolid3D: HybridSolid_menu,
    LightRegularGrid2D: RegularGrid2D_menu,
    LightRegularGrid3D: RegularGrid3D_menu,
    PointSet2D: PointSet_menu,
    PointSet3D: PointSet_menu,
    PolygonalSurface2D: PolygonalSurface_menu,
    PolygonalSurface3D: PolygonalSurface_menu,
    PolyhedralSolid3D: PolyhedralSolid_menu,
    RegularGrid2D: RegularGrid2D_menu,
    RegularGrid3D: RegularGrid3D_menu,
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
