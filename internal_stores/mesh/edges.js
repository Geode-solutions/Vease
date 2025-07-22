import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const mesh_edges_schemas = viewer_schemas.opengeodeweb_viewer.mesh.edges;

export function useMeshEdgesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function edgesVisibility(id) {
    return dataStyleStore.styles[id].edges.visibility;
  }
  function edgesActiveColoring(id) {
    return dataStyleStore.styles[id].edges.coloring.active;
  }
  function edgesColor(id) {
    return dataStyleStore.styles[id].edges.coloring.color;
  }
  function edgesSize(id) {
    return dataStyleStore.styles[id].edges.size;
  }

  /** Actions **/
  function setEdgesVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_edges_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].edges.visibility = visibility;
          console.log(
            "setEdgesVisibility",
            dataStyleStore.styles[id].edges.visibility
          );
        },
      }
    );
  }
  function setEdgesActiveColoring(id, type) {
    if (type == "color")
      setEdgesColor(id, dataStyleStore.styles[id].edges.coloring.color);
    else if (type == "vertex") {
      const vertex = dataStyleStore.styles[id].edges.coloring.vertex;
      if (vertex !== null) setEdgesVertexAttribute(id, vertex);
    } else if (type == "edges") {
      const edges = dataStyleStore.styles[id].edges.coloring.edges;
      if (edges !== null) setEdgesEdgeAttribute(id, edges);
    } else throw new Error("Unknown edges coloring type: " + type);
    dataStyleStore.styles[id].edges.coloring.active = type;
    console.log(
      "setEdgesActiveColoring",
      dataStyleStore.styles[id].edges.coloring.active
    );
  }

  function setEdgesColor(id, color) {
    viewer_call(
      {
        schema: mesh_edges_schemas.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].edges.coloring.color = color;
          console.log(
            "setEdgesColor",
            dataStyleStore.styles[id].edges.coloring.color
          );
        },
      }
    );
  }
  function setEdgesSize(id, size) {
    viewer_call(
      {
        schema: mesh_edges_schemas.size,
        params: { id, size },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].edges.size = size;
          console.log("setEdgesSize", dataStyleStore.styles[id].edges.size);
        },
      }
    );
  }

  function applyEdgesStyle(id, style) {
    setEdgesVisibility(id, style.visibility);
    setEdgesActiveColoring(id, style.coloring.active);
    // setEdgesSize(id, style.size);
  }

  return {
    edgesVisibility,
    edgesActiveColoring,
    edgesColor,
    edgesSize,
    setEdgesVisibility,
    setEdgesActiveColoring,
    setEdgesColor,
    setEdgesSize,
    applyEdgesStyle,
  };
}
