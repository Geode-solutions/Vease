import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
// import useDataStyleStore from "../../data_style.js";

export const usePointsStore = defineStore("points", () => {
  const dataStyleStore = useDataStyleStore();
  const { styles } = storeToRefs(dataStyleStore);
  const mesh_points_schemas = viewer_schemas.opengeodeweb_viewer.mesh.points;

  /** Getters **/
  const pointsVisibility = computed((id) => {
    console.log("pointsVisibility", styles);
    return styles.value[id].points.visibility;
  });
  const pointsSize = computed((id) => {
    const { styles } = storeToRefs(dataStyleStore);
    return styles.value[id].points.size;
  });
  const pointsActiveColoring = computed((id) => {
    const { styles } = storeToRefs(dataStyleStore);
    return styles.value[id].points.coloring.active;
  });
  const pointsColor = computed((id) => {
    const { styles } = storeToRefs(dataStyleStore);
    return styles.value[id].points.coloring.color;
  });
  const pointsVertexAttribute = computed((id) => {
    const { styles } = storeToRefs(dataStyleStore);
    return styles.value[id].points.coloring.vertex;
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

  function setPointsColor(id, color) {
    console.log("setPointsColor", styles);
    viewer_call(
      {
        schema: mesh_points_schemas.color,
        params: { id, color },
      },
      {
        response_function: () => {
          styles.value[id].points.coloring.color = color;
          console.log("setPointsColor", styles.value[id].points.coloring.color);
        },
      }
    );
  }

  function setPointsVertexAttribute(id, vertex_attribute) {
    viewer_call(
      {
        schema: mesh_points_schemas.vertex_attribute,
        params: { id, ...vertex_attribute },
      },
      {
        response_function: () => {
          styles.value[id].points.coloring.vertex = vertex_attribute;
          console.log(
            "setPointsVertexAttribute",
            styles.value[id].points.coloring.vertex
          );
        },
      }
    );
  }

  function setPointsSize(id, size) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.points.size,
        params: { id, size },
      },
      {
        response_function: () => {
          styles.value[id].points.size = size;
          console.log("setPointsSize", styles.value[id].points.size);
        },
      }
    );
  }

  function setPointsActiveColoring(id, type) {
    if (type == "color")
      setPointsColor(id, styles.value[id].points.coloring.color);

    // else if (type == "vertex") {
    //   const vertex = dataStyleStore.styles.value[id].points.coloring.vertex;
    //   if (vertex !== null) setPointsVertexAttribute(id, vertex);
    // } else throw new Error("Unknown edges coloring type: " + type);
    styles.value[id].points.coloring.active = type;
    console.log(
      "setPointsActiveColoring",
      styles.value[id].points.coloring.active
    );
  }

  function applyPointsStyle(id, style) {
    setPointsVisibility(id, style.visibility);
    setPointsActiveColoring(id, style.coloring.active);
    setPointsSize(id, style.size);
  }

  return {
    applyPointsStyle,
    // pointsVisibility,
    // pointsSize,
    // pointsActiveColoring,
    // pointsColor,
    // pointsVertexAttribute,
    setPointsVisibility,
    setPointsActiveColoring,
    setPointsColor,
    setPointsVertexAttribute,
    setPointsSize,
  };
});

export default usePointsStore;
