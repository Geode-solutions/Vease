import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const mesh_polyhedrons_schemas =
  viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons;

export function useMeshPolyhedronsStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function polyhedronsVisibility(id) {
    return dataStyleStore.styles[id].polyhedrons.visibility;
  }
  function polyhedronsActiveColoring(id) {
    return dataStyleStore.styles[id].polyhedrons.coloring.active;
  }
  function polyhedronsColor(id) {
    return dataStyleStore.styles[id].polyhedrons.coloring.color;
  }
  function polyhedronsVertexAttribute(id) {
    return dataStyleStore.styles[id].polyhedrons.coloring.vertex;
  }
  function polyhedronsPolygonAttribute(id) {
    return dataStyleStore.styles[id].polyhedrons.coloring.polygon;
  }
  function polyhedronsPolyhedronAttribute(id) {
    return dataStyleStores.styles[id].polyhedrons.coloring.polyhedron;
  }

  /** Actions **/
  function setPolyhedronsVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_polyhedrons_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedrons.visibility = visibility;
          console.log(
            "setPolyhedronsVisibility",
            dataStyleStore.styles[id].polyhedrons.visibility
          );
        },
      }
    );
  }
  function setPolyhedronsActiveColoring(id, type) {
    if (type == "color")
      setPolyhedronsColor(
        id,
        dataStyleStore.styles[id].polyhedrons.coloring.color
      );
    else if (type == "vertex") {
      const vertex = dataStyleStore.styles[id].polyhedrons.coloring.vertex;
      if (vertex !== null) setPolyhedronsVertexAttribute(id, vertex);
    } else if (type == "polyhedron") {
      const polyhedron =
        dataStyleStore.styles[id].polyhedrons.coloring.polyhedron;
      if (polyhedron !== null)
        setPolyhedronsPolyhedronAttribute(id, polyhedron);
    } else throw new Error("Unknown polyhedrons coloring type: " + type);
    dataStyleStore.styles[id].polyhedrons.coloring.active = type;
    console.log(
      "setPolyhedronsActiveColoring",
      dataStyleStore.styles[id].polyhedrons.coloring.active
    );
  }
  function setPolyhedronsColor(id, color) {
    viewer_call(
      {
        schema: mesh_polyhedrons_schemas.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedrons.coloring.color = color;
          console.log(
            "setPolyhedronsColor",
            dataStyleStore.styles[id].polyhedrons.coloring.color
          );
        },
      }
    );
  }

  function setPolyhedronsVertexAttribute(id, vertex_attribute) {
    viewer_call(
      {
        schema: mesh_polyhedrons_schemas.vertex_attribute,
        params: { id, ...vertex_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedrons.coloring.vertex =
            vertex_attribute;
          console.log(
            "setPolyhedronsVertexAttribute",
            dataStyleStore.styles[id].polyhedrons.coloring.vertex
          );
        },
      }
    );
  }

  function setPolyhedronsPolyhedronAttribute(id, polyhedron_attribute) {
    viewer_call(
      {
        schema: mesh_polyhedrons_schemas.polyhedron_attribute,
        params: { id, ...polyhedron_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polyhedrons.coloring.polyhedron =
            polyhedron_attribute;
          console.log(
            "setPolyhedronsPolyhedronAttribute",
            dataStyleStore.styles[id].polyhedrons.coloring.polyhedron
          );
        },
      }
    );
  }

  function applyPolyhedronsStyle(id, style) {
    setPolyhedronsVisibility(id, style.visibility);
    setPolyhedronsActiveColoring(id, style.coloring.active);
  }

  return {
    polyhedronsVisibility,
    polyhedronsActiveColoring,
    polyhedronsColor,
    polyhedronsVertexAttribute,
    polyhedronsPolygonAttribute,
    polyhedronsPolyhedronAttribute,
    setPolyhedronsVisibility,
    setPolyhedronsActiveColoring,
    setPolyhedronsColor,
    setPolyhedronsVertexAttribute,
    setPolyhedronsPolyhedronAttribute,
    applyPolyhedronsStyle,
  };
}
