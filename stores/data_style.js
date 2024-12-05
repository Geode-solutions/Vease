import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

export const useDataStyleStore = defineStore("dataStyle", {
  state: () => ({
    styles: {},
  }),
  actions: {
    addDataStyle(id) {
      this.styles.push({ id });
    },
    setMeshEdgesColor(id, color) {
      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.mesh.set_edges_color,
          params: { id, color },
        },
        {
          response_function: () => {
            this.styles[id].edges_color = color;
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
