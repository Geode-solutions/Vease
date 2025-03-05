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
    pointsConstantColor() {
      return (id) => this.styles[id].points.coloring.color;
    },
    pointsVertexAttributeName() {
      return (id) => this.styles[id].points.coloring.vertex.name;
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
    edgesConstantColor() {
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
    polygonsConstantColor() {
      return (id) => this.styles[id].polygons.coloring.color;
    },
    polygonsTextures() {
      return (id) => this.styles[id].polygons.coloring.textures;
    },
    polygonsPolygonAttributeName() {
      return (id) => this.styles[id].polygons.coloring.polygon.name;
    },
    polygonsVertexAttributeName() {
      return (id) => this.styles[id].polygons.coloring.vertex.name;
    },

    polyhedronsVisibility() {
      return (id) => this.styles[id].polyhedrons.visibility;
    },
    polyhedronsActiveColoring() {
      return (id) => this.styles[id].polyhedrons.coloring.active;
    },
    polyhedronsConstantColor() {
      return (id) => this.styles[id].polyhedrons.coloring.color;
    },
    polyhedronsPolygonAttributeName() {
      return (id) => this.styles[id].polyhedrons.coloring.polygon.name;
    },
    polyhedronsVertexAttributeName() {
      return (id) => this.styles[id].polyhedrons.coloring.vertex.name;
    },
    polyhedronsPolyhedronAttributeName() {
      return (id) => this.styles[id].polyhedrons.coloring.polyhedron.name;
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
        this.setPointsConstantColor(id, this.styles[id].points.coloring.color);
      if (type == "vertex")
        this.setPointsVertexAttributeName(
          id,
          this.styles[id].points.coloring.vertex.name
        );
      else throw new Error("Unknown points coloring type: " + type);
      this.styles[id].points.coloring.active = type;
      console.log(
        "setPointsActiveColoring",
        this.styles[id].points.coloring.active
      );
    },
    setPointsConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.points.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].points.coloring.color = color;
            console.log(
              "setPointsConstantColor",
              this.styles[id].points.coloring.color
            );
          },
        }
      );
    },
    setPointsVertexAttributeName(id, name) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.points.vertex_attribute,
          params: { id, name },
        },
        {
          response_function: () => {
            this.styles[id].points.coloring.vertex.name = name;
            console.log(
              "setPointsVertexAttributeName",
              this.styles[id].points.coloring.vertex.name
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
        this.setEdgesConstantColor(id, this.styles[id].edges.coloring.color);
      else if (type == "vertex")
        this.setEdgesVertexAttributeName(
          id,
          this.styles[id].edges.coloring.vertex.name
        );
      else if (type == "edges")
        this.setEdgesEdgeAttributeName(
          id,
          this.styles[id].edges.coloring.edges.name
        );
      else throw new Error("Unknown edges coloring type: " + type);
      this.styles[id].edges.coloring.active = type;
      console.log(
        "setEdgesActiveColoring",
        this.styles[id].edges.coloring.active
      );
    },
    setEdgesConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.edges.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges.coloring.color = color;
            console.log(
              "setEdgesConstantColor",
              this.styles[id].edges.coloring.color
            );
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
        this.setPolygonsConstantColor(
          id,
          this.styles[id].polygons.coloring.color
        );
      } else if (type == "textures") {
        this.setPolygonsTextures(
          id,
          this.styles[id].polygons.coloring.textures
        );
      } else if (type == "vertex") {
        if (this.styles[id].polygons.coloring.vertex.name !== "") {
          this.setPolygonsVertexAttributeName(
            id,
            this.styles[id].polygons.coloring.vertex.name
          );
        }
      } else if (type == "polygon") {
        this.setPolygonsPolygonAttributeName(
          id,
          this.styles[id].polygons.coloring.polygon.name
        );
      } else throw new Error("Unknown polygons coloring type: " + type);
      this.styles[id].polygons.coloring.active = type;
      console.log(
        "setPolygonsActiveColoring",
        this.styles[id].polygons.coloring.active
      );
    },
    setPolygonsConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.polygons.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.color = color;
            console.log(
              "setPolygonsConstantColor",
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
            console.log(this.name, this.styles[id].polygons.coloring.textures);
          },
        }
      );
    },
    setPolygonsVertexAttributeName(id, name) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polygons.vertex_attribute,
          params: { id, name },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.vertex.name = name;
            console.log(
              "setPolygonsVertexAttributeName",
              this.styles[id].polygons.coloring.vertex.name
            );
          },
        }
      );
    },
    setPolygonsPolygonAttributeName(id, name) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polygons.polygon_attribute,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].polygons.coloring.polygon.name = name;
            console.log(
              "setPolygonsPolygonAttributeName",
              this.styles[id].polygons.coloring.polygon.name
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
        this.setPolyhedronsConstantColor(
          id,
          this.styles[id].polyhedrons.coloring.color
        );
      else if (type == "vertex")
        this.setPolyhedronsVertexAttributeName(
          id,
          this.styles[id].polyhedrons.coloring.vertex.name
        );
      else if (type == "polyhedron")
        this.setPolyhedronsPolyhedronAttributeName(
          id,
          this.styles[id].polyhedrons.coloring.polyhedron.name
        );
      else throw new Error("Unknown polyhedrons coloring type: " + type);
      this.styles[id].polyhedrons.coloring.active = type;
      console.log(
        "setPolyhedronsActiveColoring",
        this.styles[id].polyhedrons.coloring.active
      );
    },
    setPolyhedronsConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.color = color;
            console.log(
              "setPolyhedronsConstantColor",
              this.styles[id].polyhedrons.coloring.color
            );
          },
        }
      );
    },

    setPolyhedronsVertexAttributeName(id, name) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons
              .vertex_attribute,
          params: { id, name },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.vertex.name = name;
            console.log(
              "setPolyhedronsVertexAttributeName",
              this.styles[id].polyhedrons.coloring.vertex.name
            );
          },
        }
      );
    },

    setPolyhedronsPolyhedronAttributeName(id, name) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.polyhedrons
              .polyhedron_attribute,
          params: { id, name },
        },
        {
          response_function: () => {
            this.styles[id].polyhedrons.coloring.polyhedron.name = name;
            console.log(
              "setPolyhedronsPolyhedronAttributeName",
              this.styles[id].polyhedrons.coloring.polyhedron.name
            );
          },
        }
      );
    },
  },
});
