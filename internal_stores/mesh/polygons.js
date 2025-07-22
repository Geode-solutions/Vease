import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const mesh_polygons_schemas = viewer_schemas.opengeodeweb_viewer.mesh.polygons;

export function useMeshPolygonsStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function polygonsVisibility(id) {
    return dataStyleStore.styles[id].polygons.visibility;
  }
  function polygonsActiveColoring(id) {
    return dataStyleStore.styles[id].polygons.coloring.active;
  }
  function polygonsColor(id) {
    return dataStyleStore.styles[id].polygons.coloring.color;
  }
  function polygonsTextures(id) {
    return dataStyleStore.styles[id].polygons.coloring.textures;
  }
  function polygonsPolygonAttribute(id) {
    return dataStyleStore.styles[id].polygons.coloring.polygon;
  }
  function polygonsVertexAttribute(id) {
    return dataStyleStore.styles[id].polygons.coloring.vertex;
  }

  /** Actions **/
  function setPolygonsVisibility(id, visibility) {
    viewer_call(
      {
        schema: mesh_polygons_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polygons.visibility = visibility;
          console.log(
            "setPolygonsVisibility",
            dataStyleStore.styles[id].polygons.visibility
          );
        },
      }
    );
  }
  function setPolygonsActiveColoring(id, type) {
    console.log("setPolygonsActiveColoring", id, type);
    if (type == "color") {
      setPolygonsColor(id, dataStyleStore.styles[id].polygons.coloring.color);
    } else if (type == "textures") {
      const textures = dataStyleStore.styles[id].polygons.coloring.textures;
      if (textures !== null) setPolygonsTextures(id, textures);
    } else if (type == "vertex") {
      const vertex = dataStyleStore.styles[id].polygons.coloring.vertex;
      if (vertex !== null) {
        console.log("vertex", vertex);
        setPolygonsVertexAttribute(id, vertex);
      }
    } else if (type == "polygon") {
      const polygon = dataStyleStore.styles[id].polygons.coloring.polygon;
      if (polygon !== null) setPolygonsPolygonAttribute(id, polygon);
    } else throw new Error("Unknown polygons coloring type: " + type);
    dataStyleStore.styles[id].polygons.coloring.active = type;
    console.log(
      "setPolygonsActiveColoring",
      dataStyleStore.styles[id].polygons.coloring.active
    );
  }
  function setPolygonsColor(id, color) {
    viewer_call(
      {
        schema: mesh_polygons_schemas.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polygons.coloring.color = color;
          console.log(
            "setPolygonsColor",
            dataStyleStore.styles[id].polygons.coloring.color
          );
        },
      }
    );
  }
  function setPolygonsTextures(id, textures) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.apply_textures,
        params: { id, textures },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polygons.coloring.textures = textures;
          console.log(
            "setPolygonsTextures",
            dataStyleStore.styles[id].polygons.coloring.textures
          );
        },
      }
    );
  }
  function setPolygonsVertexAttribute(id, vertex_attribute) {
    viewer_call(
      {
        schema: mesh_polygons_schemas.vertex_attribute,
        params: { id, ...vertex_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polygons.coloring.vertex = vertex_attribute;
          console.log(
            "setPolygonsVertexAttribute",
            dataStyleStore.styles[id].polygons.coloring.vertex
          );
        },
      }
    );
  }
  function setPolygonsPolygonAttribute(id, polygon_attribute) {
    viewer_call(
      {
        schema: mesh_polygons_schemas.polygon_attribute,
        params: { id, ...polygon_attribute },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].polygons.coloring.polygon =
            polygon_attribute;
          console.log(
            "setPolygonsPolygonAttribute",
            dataStyleStore.styles[id].polygons.coloring.polygon
          );
        },
      }
    );
  }

  function applyPolygonsStyle(id, style) {
    setPolygonsVisibility(id, style.visibility);
    setPolygonsActiveColoring(id, style.coloring.active);
  }

  return {
    polygonsVisibility,
    polygonsActiveColoring,
    polygonsColor,
    polygonsTextures,
    polygonsPolygonAttribute,
    polygonsVertexAttribute,
    setPolygonsVisibility,
    setPolygonsActiveColoring,
    setPolygonsColor,
    setPolygonsTextures,
    setPolygonsVertexAttribute,
    setPolygonsPolygonAttribute,
    applyPolygonsStyle,
  };
}
