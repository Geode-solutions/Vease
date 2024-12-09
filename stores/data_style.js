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
      return (id) => this.styles[id].points.visibility
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
  },
  actions: {
    addDataStyle(id, geode_object) {
      this.styles[id] = default_styles[geode_object];
      console.log("addDataStyle", this.styles[id]);
    },
    setPointsVisibility(id, visibility) {
      this.styles[id].points.visibility = visibility;
      console.log("setPointsVisibility", this.styles[id].points.visibility);
    },
    setPointsActiveColoring(id, type) {
      this.styles[id].points.color.active = type;
      console.log("setPointsActiveColoring", this.styles[id].points.color.active);
    },
    setPointsConstantColor(id, color) {
      this.styles[id].points.color.constant = color;
      console.log("setPointsConstantColor", this.styles[id].points.color.constant);
    },
    setPointsVertexAttributeName(id, name) {
      this.styles[id].points.color.vertex.name = name;
      console.log("setPointsVertexAttributeName", this.styles[id].points.color.vertex.name);
    },
    setPointsSize(id, size) {
      this.styles[id].points.size = size;
      console.log("setPointsSize", this.styles[id].points.size);
    },

    setMeshEdgesColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges_color = { color };
          },
        }
      );
    },

    setMeshEdgesSize(id, size) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].edges_size = size;
          },
        }
      );
    },

    setMeshEdgesVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].edges_visibility = visibility;
          },
        }
      );
    },

    setMeshPointsColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_color,
          params: { id, red: color["r"], green: color["g"], blue: color["b"] },
        },
        {
          response_function: () => {
            this.styles[id].points_color = color;
          },
        }
      );
    },

    setMeshPointsSize(id, size) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.styles[id].points_size = size;
          },
        }
      );
    },

    setMeshPointsVisibility(id, visibility) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].points_visibility = visibility;
          },
        }
      );
    },

    setMeshTrianglesColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_triangles_color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].triangles_color = color;
          },
        }
      );
    },
    setMeshTrianglesVisibility(id, visibility) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.set_triangles_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].triangles_visibility = visibility;
          },
        }
      );
    },
  },
});
