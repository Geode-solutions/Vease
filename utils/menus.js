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
    BRep,
    CrossSection,
    ImplicitCrossSection,
    ImplicitStructuralModel,
    Section,
    StructuralModel,
  },
};


export default menus;
