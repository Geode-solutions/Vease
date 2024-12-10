import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const polygonalSurface_defaultStyle = {
  points: {
    visibility: true,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
      vertex: { name: "" },
    },
    size: 1,
  },
  edges: {
    visibility: true,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
    },
    size: 1,
  },
  triangles: {
    visibility: true,
    color: {
      active: "",
      constant: { r: 0, g: 0, b: 0 },
      polygon: { name: "" },
      vertex: { name: "" },
    },
  },
};

const default_styles = {
  PolygonalSurface2D: polygonalSurface_defaultStyle,
  PolygonalSurface3D: polygonalSurface_defaultStyle,
};

export const useDataStyleStore = defineStore("dataStyle", {
  state: () => ({
    styles: {},
  }),
  getters: {
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

    trianglesVisibility() {
      return (id) => this.styles[id].triangles.visibility;
    },
    trianglesActiveColoring() {
      return (id) => this.styles[id].triangles.color.active;
    },
    trianglesConstantColor() {
      return (id) => this.styles[id].triangles.color.constant;
    },
    trianglesPolygonAttributeName() {
      return (id) => this.styles[id].triangles.color.polygon.name;
    },
    trianglesVertexAttributeName() {
      return (id) => this.styles[id].triangles.color.vertex.name;
    },
  },
  actions: {
    addDataStyle(id, geode_object) {
      this.styles[id] = default_styles[geode_object];
      console.log("addDataStyle", this.styles[id]);
    },
    setPointsVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_point_visibility,
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
      this.styles[id].points.color.active = type;
      console.log(
        "setPointsActiveColoring",
        this.styles[id].points.color.active
      );
      if (type === "vertex") {
        this.setPointsVertexAttributeName(
          id,
          this.styles[id].points.color.vertex.name
        );
      } else if (type === "constant") {
        this.setPointsConstantColor(
          id,
          this.styles[id].points.color.constant.color
        );
      }
    },
    setPointsConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_color,
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
            viewer_schemas.opengeodeweb_viewer.mesh.display_vertex_attribute,
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
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_point_size,
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
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_visibility,
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
      this.styles[id].edges.color.active = type;
      console.log(
        "setEdgesActiveColoring",
        this.styles[id].points.color.active
      );
      this.setPointsConstantColor(id, this.styles[id].points.color[type]);
    },
    setEdgesConstantColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_point_size,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges.color.constant = color;
            console.log(
              "setEdgesConstantColor",
              this.styles[id].points.color.constant
            );
          },
        }
      );
    },
    setEdgesSize(id, size) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].edges.size = size;
            console.log("setEdgesSize", this.styles[id].points.size);
          },
        }
      );
    },
  },
});
