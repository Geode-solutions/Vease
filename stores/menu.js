// PointSet components
import PointSetPointsColor from "@/components/Viewer/PointSet/Points/Color.vue";
import PointSetPointsSize from "@/components/Viewer/PointSet/Points/Size.vue";

// EdgedCurve components
import EdgedCurvePointsColor from "@/components/Viewer/EdgedCurve/Points/Color.vue";
import EdgedCurvePointsSize from "@/components/Viewer/EdgedCurve/Points/Size.vue";
import EdgedCurvePointsVisibility from "@/components/Viewer/EdgedCurve/Points/Visibility.vue";
import EdgedCurveEdgesColor from "@/components/Viewer/EdgedCurve/Edges/Color.vue";
import EdgedCurveEdgesSize from "@/components/Viewer/EdgedCurve/Edges/Size.vue";
import EdgedCurveEdgesVisibility from "@/components/Viewer/EdgedCurve/Edges/Visibility.vue";

// Surface components
import SurfacePointsColor from "@/components/Viewer/Surface/Points/Color.vue";
import SurfacePointsSize from "@/components/Viewer/Surface/Points/Size.vue";
import SurfacePointsVisibility from "@/components/Viewer/Surface/Points/Visibility.vue";
import SurfaceEdgesColor from "@/components/Viewer/Surface/Edges/Color.vue";
import SurfaceEdgesVisibility from "@/components/Viewer/Surface/Edges/Visibility.vue";
import SurfaceTrianglesColor from "@/components/Viewer/Surface/Triangles/Color.vue";
import SurfaceTrianglesVisibility from "@/components/Viewer/Surface/Triangles/Visibility.vue";

import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const PointSet_menu = [PointSetPointsColor, PointSetPointsSize];

const EdgedCurve_menu = [
  EdgedCurvePointsColor,
  EdgedCurvePointsSize,
  EdgedCurvePointsVisibility,
  EdgedCurveEdgesColor,
  EdgedCurveEdgesSize,
  EdgedCurveEdgesVisibility,
];

const Surface_menu = [
  SurfacePointsColor,
  SurfacePointsSize,
  SurfacePointsVisibility,
  SurfaceEdgesColor,
  SurfaceEdgesVisibility,
  SurfaceTrianglesColor,
  SurfaceTrianglesVisibility,
];

const menus = {
  mesh: {
    // PointSet2D: PointSet_menu,
    // PointSet3D: PointSet_menu,
    // EdgedCurve2D: EdgedCurve_menu,
    // EdgedCurve3D: EdgedCurve_menu,
    PolygonalSurface2D: Surface_menu,
    PolygonalSurface3D: Surface_menu,
    // TriangulatedSurface2D: Surface_menu,
    // TriangulatedSurface3D: Surface_menu,
  },
  // model: {
  //   BRep,
  //   CrossSection,
  //   ImplicitCrossSection,
  //   ImplicitStructuralModel,
  //   Section,
  //   StructuralModel,
  // },
};

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menus,
    items: [
      {
        title: "Option 1",
        icon: "mdi-microscope",
        visible: false,
        dialog: false,
        contentType: "card",
        content: {
          title: "Card Title 1",
          text: "Content for Option 1",
        },
      },
    ],
    menu: false,
  }),
  actions: {
    closeMenu() {
      this.menu = false;
      this.items.forEach((item) => {
        item.visible = false;
        item.dialog = false;
      });
    },
    openMenu(x, y) {
      const treeview_store = useTreeviewStore();
      this.closeMenu();

      const ids = treeview_store.get_ids();
      // console.log("from openMenu x y", x, y);
      // console.log("from openMenu ids", ids);

      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
          params: { x, y, ids },
        },
        {
          response_function: (response) => {
            console.log("response", response);

            const array_ids = response.array_ids;
            console.log("array_ids", array_ids);
            const id = array_ids[0];
            const { geode_object, object_type } = treeview_store.idMetaData(id);
            console.log("final geode_object", geode_object);
            console.log("final object_type", object_type);
          },
        }
      );

      setTimeout(() => {
        this.menu = true;
        this.showItemsWithDelay();
      }, 0);
    },
    showItemsWithDelay() {
      const DELAY = 50;
      this.items.forEach((item, index) => {
        setTimeout(() => {
          item.visible = true;
        }, index * DELAY);
      });
    },
    handleClick(item) {
      console.log(`Clicked on ${item.title}`);
      this.closeMenu();
    },
  },
});
