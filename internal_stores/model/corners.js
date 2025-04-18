import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const corners_schemas = viewer_schemas.opengeodeweb_viewer.model.corners;

export function useCornersStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function cornersVisibility(id) {
    return dataStyleStore.styles[id].corners.visibility;
  }

  /** Actions **/
  function setCornerVisibility(id, corner_id, visibility) {
    console.log("setCornerVisibility", id, corner_id, visibility);
    console.log("viewer_schemas", viewer_schemas);

    viewer_call(
      {
        schema: corners_schemas.visibility,
        params: { id, block_ids: [corner_id], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].corners[corner_id].visibility = visibility;
          console.log(
            "setCornersVisibility",
            dataStyleStore.styles[id].corners[corner_id].visibility
          );
        },
      }
    );
  }

  function applyCornersStyle(id, corners) {
    for (const [corner_id, style] of Object.entries(corners)) {
      setCornerVisibility(id, corner_id, style.visibility);
    }
  }

  return {
    cornersVisibility,
    setCornerVisibility,
    applyCornersStyle,
  };
}

export default useCornersStyle;
