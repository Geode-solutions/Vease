import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
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
  function setCornerVisibility(id, corner_ids, visibility) {
    const corner_flat_indexes = dataBaseStore.getFlatIndexes(id, corner_ids);
    viewer_call(
      {
        schema: corners_schemas.visibility,
        params: { id, block_ids: corner_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const corner_id of corner_ids) {
            if (!dataStyleStore.styles[id].corners[corner_id])
              dataStyleStore.styles[id].corners[corner_id] = {};
            dataStyleStore.styles[id].corners[corner_id].visibility =
              visibility;
          }
          console.log("setCornerVisibility", corner_ids, visibility);
        },
      }
    );
  }

  function setCornersDefaultStyle(id) {
    const corner_ids = dataBaseStore.getCornersUuids(id);
    console.log(
      "dataStyleStore.styles[id].corners.visibility",
      dataStyleStore.styles[id].corners.visibility
    );
    setCornerVisibility(
      id,
      corner_ids,
      dataStyleStore.styles[id].corners.visibility
    );
  }

  function applyCornersStyle(id) {
    const corners = dataStyleStore.styles[id].corners;
    for (const [corner_id, style] of Object.entries(corners)) {
      setCornerVisibility(id, [corner_id], style.visibility);
    }
  }

  return {
    cornerVisibility,
    setCornersDefaultStyle,
    setCornerVisibility,
    applyCornersStyle,
  };
}

export default useCornersStyle;
