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

// BRep components
import BrepEdgesOptions from "@vease/components/Viewer/BRep/EdgesOptions.vue";
import BRepPointsOptions from "@vease/components/Viewer/BRep/PointsOptions.vue";

// CrossSection components
import CrossSectionEdgesOptions from "@vease/components/Viewer/CrossSection/EdgesOptions.vue";
import CrossSectionPointsOptions from "@vease/components/Viewer/CrossSection/PointsOptions.vue";

// ImplicitCrossSection components
import ImplicitCrossSectionEdgesOptions from "@vease/components/Viewer/ImplicitCrossSection/EdgesOptions.vue";
import ImplicitCrossSectionPointsOptions from "@vease/components/Viewer/ImplicitCrossSection/PointsOptions.vue";

// Section components
import SectionEdgesOptions from "@vease/components/Viewer/Section/EdgesOptions.vue";
import SectionPointsOptions from "@vease/components/Viewer/Section/PointsOptions.vue";

// StructuralModel components
import StructuralModelEdgesOptions from "@vease/components/Viewer/StructuralModel/EdgesOptions.vue";
import StructuralModelPointsOptions from "@vease/components/Viewer/StructuralModel/PointsOptions.vue";

// ImplicitStructuralModel components
import ImplicitStructuralModelEdgesOptions from "@vease/components/Viewer/ImplicitStructuralModel/EdgesOptions.vue";
import ImplicitStructuralModelPointsOptions from "@vease/components/Viewer/ImplicitStructuralModel/PointsOptions.vue";

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

const BRep_menu = [BrepEdgesOptions, BRepPointsOptions];

const CrossSection_menu = [CrossSectionEdgesOptions, CrossSectionPointsOptions];

const ImplicitCrossSection_menu = [
  ImplicitCrossSectionEdgesOptions,
  ImplicitCrossSectionPointsOptions,
];
const ImplicitStructuralModel_menu = [
  ImplicitStructuralModelEdgesOptions,
  ImplicitStructuralModelPointsOptions,
];

const Section_menu = [SectionEdgesOptions, SectionPointsOptions];

const StructuralModel_menu = [
  StructuralModelEdgesOptions,
  StructuralModelPointsOptions,
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
    BRep: BRep_menu,
    CrossSection: CrossSection_menu,
    ImplicitCrossSection: ImplicitCrossSection_menu,
    ImplicitStructuralModel: ImplicitStructuralModel_menu,
    Section: Section_menu,
    StructuralModel: StructuralModel_menu,
  },
};

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menus,
    display_menu: false,
    current_id: null,
    menuX: 0,
    menuY: 0,
    containerWidth: window.innerWidth,
    containerHeight: window.innerHeight,
  }),
  getters: {
    getMenuItems: (state) => {
      return (object_type, geode_object) => {
        if (!object_type || !geode_object || !state.menus[object_type]) {
          return [];
        }
        return state.menus[object_type][geode_object] || [];
      };
    },
  },
  actions: {
    closeMenu() {
      this.display_menu = false;
      this.current_id = null;
    },
    async openMenu(id, x, y, containerWidth, containerHeight) {
      await this.closeMenu();
      this.current_id = id;

      if (x !== undefined && y !== undefined) {
        this.menuX = x;
        this.menuY = y;
      }

      if (containerWidth) this.containerWidth = containerWidth;
      if (containerHeight) this.containerHeight = containerHeight;

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
