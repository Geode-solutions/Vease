/** @format */

import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { getDefaultStyle } from "@/utils/default_styles";
import _ from "lodash";

export const useDataStyleStore = defineStore("dataStyle", {
  state: () => ({
    styles: {},
  }),
  getters: {
    objectVisibility() {
      return (id) => this.styles[id].visibility;
    },
    selectedObjects() {
      var selection = [];
      for (const [id, value] of Object.entries(this.styles)) {
        if (value.visibility == true) {
          selection.push(id);
        }
      }
      return selection;
    },
    pointsVisibility() {
      return (id) => this.styles[id].points.visibility;
    },
    pointsActiveColoring() {
      return (id) => this.styles[id].points.coloring.active;
    },
    pointsColor() {
      return (id) => this.styles[id].points.coloring.color;
    },
    pointsVertexAttribute() {
      return (id) => this.styles[id].points.coloring.vertex;
    },
    pointsSize() {
      return (id) => this.styles[id].points.size;
    },

    edgesVisibility() {
      return (id) => this.styles[id].edges.visibility;
    },
    edgesActiveColoring() {
      return (id) => this.styles[id].edges.coloring.active;
    },
    edgesColor() {
      return (id) => this.styles[id].edges.coloring.color;
    },
    edgesSize() {
      return (id) => this.styles[id].edges.size;
    },

    polygonsVisibility() {
      return (id) => this.styles[id].polygons.visibility;
    },
    polygonsActiveColoring() {
      return (id) => this.styles[id].polygons.coloring.active;
    },
    polygonsColor() {
      return (id) => this.styles[id].polygons.coloring.color;
    },
    polygonsTextures() {
      return (id) => this.styles[id].polygons.coloring.textures;
    },
    polygonsPolygonAttribute() {
      return (id) => this.styles[id].polygons.coloring.polygon;
    },
    polygonsVertexAttribute() {
      return (id) => this.styles[id].polygons.coloring.vertex;
    },

    polyhedronsVisibility() {
      return (id) => this.styles[id].polyhedrons.visibility;
    },
    polyhedronsActiveColoring() {
      return (id) => this.styles[id].polyhedrons.coloring.active;
    },
    polyhedronsColor() {
      return (id) => this.styles[id].polyhedrons.coloring.color;
    },
    polyhedronsVertexAttribute() {
      return (id) => this.styles[id].polyhedrons.coloring.vertex;
    },
    polyhedronsPolygonAttribute() {
      return (id) => this.styles[id].polyhedrons.coloring.polygon;
    },
    polyhedronsPolyhedronAttribute() {
      return (id) => this.styles[id].polyhedrons.coloring.polyhedron;
    },
  },
  actions: {
    addDataStyle(id, geode_object) {
      this.styles[id] = getDefaultStyle(geode_object);
      this.applyDefaultStyle(id);
    },
    applyDefaultStyle(id) {
      const style = this.styles[id];
      for (const [key, value] of Object.entries(style)) {
        if (key == "visibility") this.setVisibility(id, value);
        else if (key == "points") this.applyPointsStyle(id, value);
        else if (key == "edges") this.applyEdgesStyle(id, value);
        else if (key == "polygons") this.applyPolygonsStyle(id, value);
        else if (key == "polyhedrons") this.applyPolyhedronsStyle(id, value);
      }
    },
    applyPointsStyle(id, style) {
      this.setPointsVisibility(id, style.visibility);
      this.setPointsActiveColoring(id, style.coloring.active);
      this.setPointsSize(id, style.size);
    },
    applyEdgesStyle(id, style) {
      this.setEdgesVisibility(id, style.visibility);
      this.setEdgesActiveColoring(id, style.coloring.active);
      // this.setEdgesSize(id, style.size);
    },
    applyPolygonsStyle(id, style) {
      this.setPolygonsVisibility(id, style.visibility);
      this.setPolygonsActiveColoring(id, style.coloring.active);
    },
    applyPolyhedronsStyle(id, style) {
      this.setPolyhedronsVisibility(id, style.visibility);
      this.setPolyhedronsActiveColoring(id, style.coloring.active);
    },
    setVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].visibility = visibility;
            console.log("setVisibility", this.styles[id].visibility);
          },
        }
      );
    },
    setPointsVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.points.visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].points.visibility = visibility;
            console.log(
              "setPointsVisibility",
              this.styles[id].points.visibility
            );
          },
        }
      );
    },
    setPointsActiveColoring(id, type) {
      if (type == "color")
        this.setPointsColor(id, this.styles[id].points.coloring.color);
      else if (type == "vertex") {
        const vertex = this.styles[id].points.coloring.vertex;
        if (vertex !== null) this.setPointsVertexAttribute(id, vertex);
      } else throw new Error("Unknown edges coloring type: " + type);
      this.styles[id].points.coloring.active = type;
      console.log(
        "setPointsActiveColoring",
        this.styles[id].points.coloring.active
      );
    },
    setPointsColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.points.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].points.coloring.color = color;
            console.log(
              "setPointsColor",
              this.styles[id].points.coloring.color
            );
          },
        }
      );
    },
    setPointsVertexAttribute(id, vertex_attribute) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.points.vertex_attribute,
          params: { id, ...vertex_attribute },
        },
        {
          response_function: () => {
            this.styles[id].points.coloring.vertex = vertex_attribute;
            console.log(
              "setPointsVertexAttribute",
              this.styles[id].points.coloring.vertex
            );
          },
        }
      );
    },
    setPointsSize(id, size) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.points.size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].points.size = size;
            console.log("setPointsSize", this.styles[id].points.size);
          },
        }
      );
    },

    setEdgesVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.edges.visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].edges.visibility = visibility;
            console.log("setEdgesVisibility", this.styles[id].edges.visibility);
          },
        }
      );
    },
    setEdgesActiveColoring(id, type) {
      if (type == "color")
        this.setEdgesColor(id, this.styles[id].edges.coloring.color);
      else if (type == "vertex") {
        const vertex = this.styles[id].edges.coloring.vertex;
        if (vertex !== null) this.setEdgesVertexAttribute(id, vertex);
      } else if (type == "edges") {
        const edges = this.styles[id].edges.coloring.edges;
        if (edges !== null) this.setEdgesEdgeAttribute(id, edges);
      } else throw new Error("Unknown edges coloring type: " + type);
      this.styles[id].edges.coloring.active = type;
      console.log(
        "setEdgesActiveColoring",
        this.styles[id].edges.coloring.active
      );
    },
    setEdgesColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.edges.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges.coloring.color = color;
            console.log("setEdgesColor", this.styles[id].edges.coloring.color);
          },
        }
      );
    },
    setEdgesSize(id, size) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.edges.size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].edges.size = size;
            console.log("setEdgesSize", this.styles[id].edges.size);
          },
        }
      );
    },

    setPolygonsVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.polygons.visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].polygons.visibility = visibility;
            console.log(
              "setPolygonsVisibility",
              this.styles[id].polygons.visibility
            );
          },
        }
      );
    },
    setPolygonsActiveColoring(id, type) {
      console.log("setPolygonsActiveColoring", id, type);
      if (type == "color") {
        this.setPolygonsColor(id, this.styles[id].polygons.coloring.color);
      } else if (type == "textures") {
        const textures = this.styles[id].polygons.coloring.textures;
        if (textures !== null) this.setPolygonsTextures(id, textures);
      } else if (type == "vertex") {
        const vertex = this.styles[id].polygons.coloring.vertex;
        if (vertex !== null) {
          console.log("vertex", vertex);
          this.setPolygonsVertexAttribute(id, vertex);
        }
      } else if (type == "polygon") {
        const polygon = this.styles[id].polygons.coloring.polygon;
        if (polygon !== null) this.setPolygonsPolygonAttribute(id, polygon);
      } else throw new Error("Unknown polygons coloring type: " + type);
      this.styles[id].polygons.coloring.active = type;
      console.log(
        "setPolygonsActiveColoring",
        this.styles[id].polygons.coloring.active
      );
    },
    setPolygonsColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.polygons.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.color = color;
            console.log(
              "setPolygonsColor",
              this.styles[id].polygons.coloring.color
            );
          },
        }
      );
    },
    setPolygonsTextures(id, textures) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.apply_textures,
          params: { id, textures },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.textures = textures;
            console.log(
              "setPolygonsTextures",
              this.styles[id].polygons.coloring.textures
            );
          },
        }
      );
    },
    setPolygonsVertexAttribute(id, vertex_attribute) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polygons.vertex_attribute,
          params: { id, ...vertex_attribute },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.vertex = vertex_attribute;
            console.log(
              "setPolygonsVertexAttribute",
              this.styles[id].polygons.coloring.vertex
            );
          },
        }
      );
    },
    setPolygonsPolygonAttribute(id, polygon_attribute) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polygons.polygon_attribute,
          params: { id, ...polygon_attribute },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.polygon = polygon_attribute;
            console.log(
              "setPolygonsPolygonAttribute",
              this.styles[id].polygons.coloring.polygon
            );
          },
        }
      );
    },

    setPolyhedronsVisibility(id, visibility) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons.visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.visibility = visibility;
            console.log(
              "setPolyhedronsVisibility",
              this.styles[id].polyhedrons.visibility
            );
          },
        }
      );
    },
    setPolyhedronsActiveColoring(id, type) {
      if (type == "color")
        this.setPolyhedronsColor(
          id,
          this.styles[id].polyhedrons.coloring.color
        );
      else if (type == "vertex") {
        const vertex = this.styles[id].polyhedrons.coloring.vertex;
        if (vertex !== null) this.setPolyhedronsVertexAttribute(id, vertex);
      } else if (type == "polyhedron") {
        const polyhedron = this.styles[id].polyhedrons.coloring.polyhedron;
        if (polyhedron !== null)
          this.setPolyhedronsPolyhedronAttribute(id, polyhedron);
      } else throw new Error("Unknown polyhedrons coloring type: " + type);
      this.styles[id].polyhedrons.coloring.active = type;
      console.log(
        "setPolyhedronsActiveColoring",
        this.styles[id].polyhedrons.coloring.active
      );
    },
    setPolyhedronsColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.color = color;
            console.log(
              "setPolyhedronsColor",
              this.styles[id].polyhedrons.coloring.color
            );
          },
        }
      );
    },

    setPolyhedronsVertexAttribute(id, vertex_attribute) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons
              .vertex_attribute,
          params: { id, ...vertex_attribute },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.vertex = vertex_attribute;
            console.log(
              "setPolyhedronsVertexAttribute",
              this.styles[id].polyhedrons.coloring.vertex
            );
          },
        }
      );
    },

    setPolyhedronsPolyhedronAttribute(id, polyhedron_attribute) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons
              .polyhedron_attribute,
          params: { id, ...polyhedron_attribute },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.polyhedron =
              polyhedron_attribute;
            console.log(
              "setPolyhedronsPolyhedronAttribute",
              this.styles[id].polyhedrons.coloring.polyhedron
            );
          },
        }
      );
    },
  },
});
