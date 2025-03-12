import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import useState from "~/internal_stores/state.js";
const mesh_points_schemas = viewer_schemas.opengeodeweb_viewer.mesh.points;

export function usePointsStyle() {
  const { styles } = useState();

  /** Getters **/
  const pointsVisibility = computed((id) => {
    console.log("pointsVisibility", dataStyleStore);
    return styles.value[id].points.visibility;
  });

  /** Actions **/
  function setPointsVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_points_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          styles.value[id].points.visibility = visibility;
          console.log(
            "setPointsVisibility",
            styles.value[id].points.visibility
          );
        },
      }
    );
  }

  function setPointsActiveColoring(id, type) {
    if (type == "color")
      setPointsColor(id, styles.value[id].points.coloring.color);
    styles.value[id].points.coloring.active = type;
    console.log(
      "setPointsActiveColoring",
      styles.value[id].points.coloring.active
    );
  }

  function applyPointsStyle(id, style) {
    setPointsVisibility(id, style.visibility);
  }

  return {
    pointsVisibility,
    setPointsVisibility,
    setPointsActiveColoring,
    applyPointsStyle,
  };
}

export default usePointsStyle;
