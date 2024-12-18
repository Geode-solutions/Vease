// PointSet components
import PointSetPointsOptions from "@/components/Viewer/PointSet/PointsOptions.vue";

// EdgedCurve components
import EdgedCurvePointsOptions from "@/components/Viewer/EdgedCurve/PointsOptions.vue";
import EdgedCurveEdgesOptions from "@/components/Viewer/EdgedCurve/EdgesOptions.vue";

// Surface components
import SurfacePointsOptions from "@/components/Viewer/Surface/PointsOptions.vue";
import SurfaceEdgesOptions from "@/components/Viewer/Surface/EdgesOptions.vue";
import SurfaceTrianglesOptions from "@/components/Viewer/Surface/TrianglesOptions.vue";

const PointSet_menu = [PointSetPointsOptions];

const EdgedCurve_menu = [EdgedCurvePointsOptions, EdgedCurveEdgesOptions];

const Surface_menu = [
  SurfacePointsOptions,
  SurfaceEdgesOptions,
  SurfaceTrianglesOptions,
];

const menus = {
  mesh: {
    PointSet2D: PointSet_menu,
    PointSet3D: PointSet_menu,
    EdgedCurve2D: EdgedCurve_menu,
    EdgedCurve3D: EdgedCurve_menu,
    PolygonalSurface2D: Surface_menu,
    PolygonalSurface3D: Surface_menu,
    TriangulatedSurface2D: Surface_menu,
    TriangulatedSurface3D: Surface_menu,
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
      console.log("CLOSE STORE", this.display_menu);
    },
    async openMenu() {
      await this.closeMenu();
      this.display_menu = true;
      console.log("FROM STORE", this.display_menu);
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
