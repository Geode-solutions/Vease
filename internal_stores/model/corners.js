import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const corners_schemas = viewer_schemas.opengeodeweb_viewer.model.corners;

export function useCornersStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();
  const dataBaseStore = useDataBaseStore();

  /** Getters **/
  function cornerVisibility(id, corner_id) {
    return dataStyleStore.styles[id].corners[corner_id].visibility;
  }

  /** Actions **/
  function setCornerVisibility(id, corner_id, visibility) {
    console.log("setCornerVisibility", id, corner_id, visibility);
    const flat_index = dataBaseStore.getFlatIndex(id, corner_id);
    viewer_call(
      {
        schema: corners_schemas.visibility,
        params: { id, block_ids: [flat_index], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].corners[corner_id].visibility = visibility;
          console.log(
            "setCornerVisibility",
            dataStyleStore.styles[id].corners[corner_id].visibility
          );
        },
      }
    );
  }

  function applyCornersStyle(id) {
    const corners = dataStyleStore.styles[id].corners;
    for (const [corner_id, style] of Object.entries(corners)) {
      setCornerVisibility(id, corner_id, style.visibility);
    }
  }

  return {
    cornerVisibility,
    setCornerVisibility,
    applyCornersStyle,
  };
}

export default useCornersStyle;
