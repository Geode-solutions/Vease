// PointSet components
import PointSetPointsColor from "@/components/Viewer/PointSet/Points/Color.vue";
import PointSetPointsSize from "@/components/Viewer/PointSet/Points/Size.vue";

// EdgedCurve components
import EdgedCurvePointsColor from "@/components/Viewer/EdgedCurve/Points/Color.vue";
import EdgedCurvePointsSize from "@/components/Viewer/EdgedCurve/Points/Size.vue";
import EdgedCurveEdgesColor from "@/components/Viewer/EdgedCurve/Edges/Color.vue";
import EdgedCurveEdgesSize from "@/components/Viewer/EdgedCurve/Edges/Size.vue";

// Surface components
import SurfacePointsColor from "@/components/Viewer/Surface/Points/Color.vue";
import SurfacePointsSize from "@/components/Viewer/Surface/Points/Size.vue";
import SurfaceEdgesColor from "@/components/Viewer/Surface/Edges/Color.vue";
import SurfaceTrianglesColor from "@/components/Viewer/Surface/Triangles/Color.vue";

import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const PointSet_menu = [PointSetPointsColor, PointSetPointsSize];

const EdgedCurve_menu = [
  EdgedCurvePointsColor,
  EdgedCurvePointsSize,
  EdgedCurveEdgesColor,
  EdgedCurveEdgesSize,
];

const Surface_menu = [
  // shallowRef(SurfacePointsColor),
  // shallowRef(SurfacePointsSize),
  // shallowRef(SurfaceEdgesColor),
  // shallowRef(SurfaceTrianglesColor),
];

const menus = {
  mesh: {
    // PointSet2D: PointSet_menu,
    // PointSet3D: PointSet_menu,
    // EdgedCurve2D: EdgedCurve_menu,
    // EdgedCurve3D: EdgedCurve_menu,
    // PolygonalSurface2D: Surface_menu,
    PolygonalSurface3D: Surface_menu,
    // TriangulatedSurface2D: Surface_menu,
    // TriangulatedSurface3D: Surface_menu,
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
      return (object_type, geode_object) => state.menus[object_type][geode_object]
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
