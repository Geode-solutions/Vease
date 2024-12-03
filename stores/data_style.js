import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

export const useDataStyleStore = defineStore("dataStyle", {
  state: () => ({
    data_style: {},
  }),
  actions: {
    addDataStyle(id) {
      this.data_style.push({ id });
    },
    async setMeshEdgesColor(id, color) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.data_style[id].edges_color = color;
          },
        }
      );
    },

    async setMeshEdgesSize(id, size) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.data_style[id].edges_size = size;
          },
        }
      );
    },

    async setMeshEdgesVisibility(id, visibility) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.data_style[id].edges_visibility = visibility;
          },
        }
      );
    },

    async setMeshPointsColor(id, color) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_color,
          params: { id, red: color["r"], green: color["g"], blue: color["b"] },
        },
        {
          response_function: () => {
            this.data_style[id].points_color = color;
          },
        }
      );
    },

    async setMeshPointsSize(id, size) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_size,
          params: { id, size },
        },
        {
          response_function: () => {
            this.data_style[id].points_size = size;
          },
        }
      );
    },

    async setMeshPointsVisibility(id, visibility) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_points_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.data_style[id].points_visibility = visibility;
          },
        }
      );
    },

    async setMeshTrianglesColor(id, color) {
      await viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_triangles_color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.data_style[id].triangles_color = color;
          },
        }
      );
    },
    async setMeshTrianglesVisibility(id, visibility) {
      await viewer_call(
        {
          schema:
            viewer_schemas.opengeodeweb_viewer.mesh.set_triangles_visibility,
          params: { id, visibility },
        },
        {
          response_function: () => {
            this.data_style[id].triangles_visibility = visibility;
          },
        }
      );
    },
  },
});
