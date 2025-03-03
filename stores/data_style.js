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
      return (id) => this.styles[id].points.color.active;
    },
    pointsConstantColor() {
      return (id) => this.styles[id].points.color.constant;
    },
    pointsVertexAttributeName() {
      return (id) => this.styles[id].points.color.vertex.name;
    },
    pointsSize() {
      return (id) => this.styles[id].points.size;
    },

    edgesVisibility() {
      return (id) => this.styles[id].edges.visibility;
    },
    edgesActiveColoring() {
      return (id) => this.styles[id].edges.color.active;
    },
    edgesConstantColor() {
      return (id) => this.styles[id].edges.color.constant;
    },
    edgesSize() {
      return (id) => this.styles[id].edges.size;
    },

    polygonsVisibility() {
      return (id) => this.styles[id].polygons.visibility;
    },
    polygonsActiveColoring() {
      return (id) => this.styles[id].polygons.color.active;
    },
    polygonsConstantColor() {
      return (id) => this.styles[id].polygons.color.constant;
    },
    polygonsTextures() {
      return (id) => this.styles[id].polygons.color.textures;
    },
    polygonsPolygonAttributeName() {
      return (id) => this.styles[id].polygons.color.polygon.name;
    },
    polygonsVertexAttributeName() {
      return (id) => this.styles[id].polygons.color.vertex.name;
    },

    polyhedronsVisibility() {
      return (id) => this.styles[id].polyhedrons.visibility;
    },
    polyhedronsActiveColoring() {
      return (id) => this.styles[id].polyhedrons.color.active;
    },
    polyhedronsConstantColor() {
      return (id) => this.styles[id].polyhedrons.color.constant;
    },
    polyhedronsPolygonAttributeName() {
      return (id) => this.styles[id].polyhedrons.color.polygon.name;
    },
    polyhedronsVertexAttributeName() {
      return (id) => this.styles[id].polyhedrons.color.vertex.name;
    },
    polyhedronsPolyhedronAttributeName() {
      return (id) => this.styles[id].polyhedrons.color.polyhedron.name;
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
      this.setPointsActiveColoring(id, style.color.active);
      this.setPointsSize(id, style.size);
    },
    applyEdgesStyle(id, style) {
      this.setEdgesVisibility(id, style.visibility);
      this.setEdgesActiveColoring(id, style.color.active);
      // this.setEdgesSize(id, style.size);
    },
    applyPolygonsStyle(id, style) {
      this.setPolygonsVisibility(id, style.visibility);
      this.setPolygonsActiveColoring(id, style.color.active);
    },
    applyPolyhedronsStyle(id, style) {
      this.setPolyhedronsVisibility(id, style.visibility);
      this.setPolyhedronsActiveColoring(id, style.color.active);
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
      switch (type) {
        case "constant":
          this.setPointsConstantColor(
            id,
            this.styles[id].points.color.constant
          );
          break;
        case "vertex":
          this.setPointsVertexAttributeName(
            id,
            this.styles[id].points.color.vertex.name
          );
          break;
      }
      this.styles[id].points.color.active = type;
      console.log(
        "setPointsActiveColoring",
        this.styles[id].points.color.active
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
            this.styles[id].points.color.constant = color;
            console.log(
              "setPointsConstantColor",
              this.styles[id].points.color.constant
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
            this.styles[id].points.color.vertex.name = name;
            console.log(
              "setPointsVertexAttributeName",
              this.styles[id].points.color.vertex.name
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
      if (type == "constant")
        this.setEdgesConstantColor(id, this.styles[id].edges.color.constant);
      else if (type == "vertex")
        this.setEdgesVertexAttributeName(
          id,
          this.styles[id].edges.color.vertex.name
        );
      else if (type == "edges")
        this.setEdgesEdgeAttributeName(
          id,
          this.styles[id].edges.color.edges.name
        );
      else throw new Error("Unknown edges coloring type: " + type);
      this.styles[id].edges.color.active = type;
      console.log("setEdgesActiveColoring", this.styles[id].edges.color.active);
    },
    setEdgesConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.edges.color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges.color.constant = color;
            console.log(
              "setEdgesConstantColor",
              this.styles[id].edges.color.constant
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
      if (type == "constant") {
        this.setPolygonsConstantColor(
          id,
          this.styles[id].polygons.color.constant
        );
      } else if (type == "textures") {
        this.setPolygonsTextures(id, this.styles[id].polygons.color.textures);
      } else if (type == "vertex") {
        if (this.styles[id].polygons.color.vertex.name !== "") {
          this.setPolygonsVertexAttributeName(
            id,
            this.styles[id].polygons.color.vertex.name
          );
        }
      } else if (type == "polygon") {
        this.setPolygonsPolygonAttributeName(
          id,
          this.styles[id].polygons.color.polygon.name
        );
      } else throw new Error("Unknown polygons coloring type: " + type);
      this.styles[id].polygons.color.active = type;
      console.log(
        "setPolygonsActiveColoring",
        this.styles[id].polygons.color.active
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
            this.styles[id].polygons.color.constant = color;
            console.log(
              "setPolygonsConstantColor",
              this.styles[id].polygons.color.constant
            );
          },
        }
      );
    },
    setPolygonsTextures(id, textures) {
      console.log("setPolygonsTextures", id, textures);
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.apply_textures,
          params: { id, textures },
        },
        {
          response_function: () => {
            this.styles[id].polygons.color.textures = textures;
            console.log(
              "setPolygonsTextures",
              this.styles[id].polygons.color.textures
            );
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
            this.styles[id].polygons.color.vertex.name = name;
            console.log(
              "setPolygonsVertexAttributeName",
              this.styles[id].polygons.color.vertex.name
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
            this.styles[id].polygons.color.polygon.name = name;
            console.log(
              "setPolygonsPolygonAttributeName",
              this.styles[id].polygons.color.polygon.name
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
      if (type == "constant")
        this.setPolyhedronsConstantColor(
          id,
          this.styles[id].polyhedrons.color.constant
        );
      else if (type == "vertex")
        this.setPolyhedronsVertexAttributeName(
          id,
          this.styles[id].polyhedrons.color.vertex.name
        );
      else if (type == "polyhedron")
        this.setPolyhedronsPolyhedronAttributeName(
          id,
          this.styles[id].polyhedrons.color.polyhedron.name
        );
      else throw new Error("Unknown polyhedrons coloring type: " + type);
      this.styles[id].polyhedrons.color.active = type;
      console.log(
        "setPolyhedronsActiveColoring",
        this.styles[id].polyhedrons.color.active
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
            this.styles[id].polyhedrons.color.constant = color;
            console.log(
              "setPolyhedronsConstantColor",
              this.styles[id].polyhedrons.color.constant
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
            this.styles[id].polyhedrons.color.vertex.name = name;
            console.log(
              "setPolyhedronsVertexAttributeName",
              this.styles[id].polyhedrons.color.vertex.name
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
            this.styles[id].polyhedrons.color.polyhedron.name = name;
            console.log(
              "setPolyhedronsPolyhedronAttributeName",
              this.styles[id].polyhedrons.color.polyhedron.name
            );
          },
        }
      );
    },
  },
});
