import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const mesh_polyhedra_schemas =
  viewer_schemas.opengeodeweb_viewer.mesh.polyhedra;

export function useMeshPolyhedraStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function polyhedraVisibility(id) {
    return dataStyleStore.styles[id].polyhedra.visibility;
  }
  function polyhedraActiveColoring(id) {
    return dataStyleStore.styles[id].polyhedra.coloring.active;
  }
  function polyhedraColor(id) {
    return dataStyleStore.styles[id].polyhedra.coloring.color;
  }
  function polyhedraVertexAttribute(id) {
    return dataStyleStore.styles[id].polyhedra.coloring.vertex;
  }
  function polyhedraPolygonAttribute(id) {
    return dataStyleStore.styles[id].polyhedra.coloring.polygon;
  }
  function polyhedraPolyhedronAttribute(id) {
    return dataStyleStore.styles[id].polyhedra.coloring.polyhedron;
  }

  /** Actions **/
  function setPolyhedraVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_polyhedra_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedra.visibility = visibility;
          console.log(
            "setPolyhedraVisibility",
            dataStyleStore.styles[id].polyhedra.visibility
          );
        },
      }
    );
  }
  function setPolyhedraActiveColoring(id, type) {
    if (type == "color")
      setPolyhedraColor(id, dataStyleStore.styles[id].polyhedra.coloring.color);
    else if (type == "vertex") {
      const vertex = dataStyleStore.styles[id].polyhedra.coloring.vertex;
      if (vertex !== null) setPolyhedraVertexAttribute(id, vertex);
    } else if (type == "polyhedron") {
      const polyhedron =
        dataStyleStore.styles[id].polyhedra.coloring.polyhedron;
      if (polyhedron !== null) setPolyhedraPolyhedronAttribute(id, polyhedron);
    } else throw new Error("Unknown polyhedra coloring type: " + type);
    dataStyleStore.styles[id].polyhedra.coloring.active = type;
    console.log(
      "setPolyhedraActiveColoring",
      dataStyleStore.styles[id].polyhedra.coloring.active
    );
  }
  function setPolyhedraColor(id, color) {
    viewer_call(
      {
        schema: mesh_polyhedra_schemas.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedra.coloring.color = color;
          console.log(
            "setPolyhedraColor",
            dataStyleStore.styles[id].polyhedra.coloring.color
          );
        },
      }
    );
  }

  function setPolyhedraVertexAttribute(id, vertex_attribute) {
    viewer_call(
      {
        schema: mesh_polyhedra_schemas.vertex_attribute,
        params: { id, ...vertex_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedra.coloring.vertex =
            vertex_attribute;
          console.log(
            "setPolyhedraVertexAttribute",
            dataStyleStore.styles[id].polyhedra.coloring.vertex
          );
        },
      }
    );
  }

  function setPolyhedraPolyhedronAttribute(id, polyhedron_attribute) {
    viewer_call(
      {
        schema: mesh_polyhedra_schemas.polyhedron_attribute,
        params: { id, ...polyhedron_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedra.coloring.polyhedron =
            polyhedron_attribute;
          console.log(
            "setPolyhedraPolyhedronAttribute",
            dataStyleStore.styles[id].polyhedra.coloring.polyhedron
          );
        },
      }
    );
  }

  function applyPolyhedraStyle(id, style) {
    setPolyhedraVisibility(id, style.visibility);
    setPolyhedraActiveColoring(id, style.coloring.active);
  }

  return {
    polyhedraVisibility,
    polyhedraActiveColoring,
    polyhedraColor,
    polyhedraVertexAttribute,
    polyhedraPolygonAttribute,
    polyhedraPolyhedronAttribute,
    setPolyhedraVisibility,
    setPolyhedraActiveColoring,
    setPolyhedraColor,
    setPolyhedraVertexAttribute,
    setPolyhedraPolyhedronAttribute,
    applyPolyhedraStyle,
  };
}
