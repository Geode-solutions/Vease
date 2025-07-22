import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const mesh_points_schemas = viewer_schemas.opengeodeweb_viewer.mesh.points;

export function useMeshPointsStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function pointsVisibility(id) {
    return dataStyleStore.styles[id].points.visibility;
  }
  function pointsActiveColoring(id) {
    return dataStyleStore.styles[id].points.coloring.active;
  }
  function pointsColor(id) {
    return dataStyleStore.styles[id].points.coloring.color;
  }
  function pointsVertexAttribute(id) {
    return dataStyleStore.styles[id].points.coloring.vertex;
  }
  function pointsSize(id) {
    return dataStyleStore.styles[id].points.size;
  }

  /** Actions **/
  function setPointsVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_points_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.visibility = visibility;
          console.log(
            "setPointsVisibility",
            dataStyleStore.styles[id].points.visibility
          );
        },
      }
    );
  }

  function setPointsColor(id, color) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.points.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.coloring.color = color;
          console.log(
            "setPointsColor",
            dataStyleStore.styles[id].points.coloring.color
          );
        },
      }
    );
  }
  function setPointsVertexAttribute(id, vertex_attribute) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.points.vertex_attribute,
        params: { id, ...vertex_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.coloring.vertex = vertex_attribute;
          console.log(
            "setPointsVertexAttribute",
            dataStyleStore.styles[id].points.coloring.vertex
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
          dataStyleStore.styles[id].points.size = size;
          console.log("setPointsSize", dataStyleStore.styles[id].points.size);
        },
      }
    );
  }

  function setPointsActiveColoring(id, type) {
    if (type == "color")
      dataStyleStore.setPointsColor(
        id,
        dataStyleStore.styles[id].points.coloring.color
      );
    else if (type == "vertex") {
      const vertex = dataStyleStore.styles[id].points.coloring.vertex;
      if (vertex !== null) dataStyleStore.setPointsVertexAttribute(id, vertex);
    } else throw new Error("Unknown edges coloring type: " + type);
    dataStyleStore.styles[id].points.coloring.active = type;
    console.log(
      "setPointsActiveColoring",
      dataStyleStore.styles[id].points.coloring.active
    );
  }

  function applyPointsStyle(id, style) {
    setPointsVisibility(id, style.visibility);
    setPointsActiveColoring(id, style.coloring.active);
    setPointsSize(id, style.size);
  }

  return {
    pointsVisibility,
    pointsActiveColoring,
    pointsColor,
    pointsVertexAttribute,
    pointsSize,
    setPointsVisibility,
    setPointsActiveColoring,
    setPointsColor,
    setPointsVertexAttribute,
    setPointsSize,
    applyPointsStyle,
  };
}

export default useMeshPointsStyle;
