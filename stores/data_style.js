import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { getDefaultStyle } from "@/utils/default_styles";

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
          if (value.visibility == true) selection.push(id);
        }
        console.log("selectedObjects", selection);
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
      console.log("FROM addDataStyle", id, geode_object);
      this.styles[id] = getDefaultStyle(geode_object);
      console.log("addDataStyle", this.styles);
    },

    removeObjectFromSelection(id) {
      this.selection = this.selection.filter((item) => item.id !== id);
      console.log("removeObjectFromSelection", this.selection);
    },

    setVisibility(id, visibility) {
      viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.model.set_components_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.styles[id].visibility = visibility;
            console.log("setVisibility", this.styles[id].visibility);
            removeObjectFromSelection(id);
          },
        }
      );
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
          s,
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

    setTrianglesVisibility(id, visibility) {
      // viewer_call(
      //   {
      //     schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
      //     params: { id, size },
      //   },
      //   {
      //     response_function: () => {
      this.styles[id].triangles.visibility = visibility;
      console.log(
        "setTrianglesVisibility",
        this.styles[id].triangles.visibility
      );
      //     },
      //   }
      // )
    },
    setTrianglesActiveColoring(id, type) {
      // viewer_call(
      //   {
      //     schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
      //     params: { id, size },
      //   },
      //   {
      //     response_function: () => {
      this.styles[id].triangles.color.active = type;
      console.log(
        "setTrianglesActiveColoring",
        this.styles[id].triangles.color.active
      );
      //     },
      //   }
      // )

      this.styles[id].triangles.color.active = type;
    },
    setTrianglesConstantColor(id, color) {
      // viewer_call(
      //   {
      //     schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
      //     params: { id, size },
      //   },
      //   {
      //     response_function: () => {
      this.styles[id].triangles.color.constant = color;
      console.log(
        "setTrianglesConstantColor",
        this.styles[id].triangles.color.constant
      );
      //     },
      //   }
      // )
    },
    setTrianglesVertexAttributeName(id, name) {
      // viewer_call(
      //   {
      //     schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
      //     params: { id, size },
      //   },
      //   {
      //     response_function: () => {
      this.styles[id].triangles.color.vertex.name = name;
      console.log(
        "setTrianglesVertexAttributeName",
        this.styles[id].triangles.color.vertex.name
      );
      //     },
      //   }
      // )
    },
    setTrianglesPolygonAttributeName(id, name) {
      // viewer_call(
      //   {
      //     schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
      //     params: { id, size },
      //   },
      //   {
      //     response_function: () => {
      this.styles[id].triangles.color.polygon.name = name;
      console.log(
        "setTrianglesPolygonAttributeName",
        this.styles[id].triangles.color.polygon.name
      );
      //     },
      //   }
      // )
    },
  },
});
