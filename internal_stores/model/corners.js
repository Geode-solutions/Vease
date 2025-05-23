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
  function setCornerVisibility(id, corner_ids, visibility) {
    const corner_flat_indexes = dataBaseStore.getFlatIndexes(id, corner_ids);
    viewer_call(
      {
        schema: corners_schemas.visibility,
        params: { id, block_ids: corner_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const corner_id of corner_ids)
            dataStyleStore.styles[id].corners[corner_id].visibility =
              visibility;
          console.log("setCornerVisibility", corner_ids, visibility);
        },
      }
    );
  }

  function setCornersDefaultStyle(id) {
    const corners = dataBaseStore.db[id]?.mesh_components?.["Corner"];
    if (!corners || corners.length === 0) return;

    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }

    if (!dataStyleStore.styles[id].corners) {
      dataStyleStore.styles[id].corners = {};
    }

    const corner_ids = [];

    for (const corner_id of corners) {
      dataStyleStore.styles[id].corners[corner_id] = cornerDefaultStyle(true);
      corner_ids.push(corner_id);
    }

    setCornerVisibility(id, corner_ids, true);
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
