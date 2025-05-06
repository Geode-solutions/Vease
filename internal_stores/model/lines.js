import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const lines_schemas = viewer_schemas.opengeodeweb_viewer.model.lines;

export function useLinesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();
  const dataBaseStore = useDataBaseStore();

  /** Getters **/
  function lineVisibility(id, line_id) {
    return dataStyleStore.styles[id].lines[line_id].visibility;
  }

  /** Actions **/
  function setLineVisibility(id, line_ids, visibility) {
    const line_flat_indexes = dataBaseStore.getFlatIndexes(id, line_ids);
    viewer_call(
      {
        schema: lines_schemas.visibility,
        params: { id, block_ids: line_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const line_id of line_ids)
            dataStyleStore.styles[id].lines[line_id].visibility = visibility;
          console.log("setLineVisibility", line_ids, visibility);
        },
      }
    );
  }

  function setLinesDefaultStyle(id) {
    var line_ids = [];
    for (const line_id of dataBaseStore.db[id].mesh_components["Line"]) {
      line_ids.push(line_id);
      dataStyleStore.styles[id].lines[line_id] = lineDefaultStyle(true);
    }
    setLineVisibility(id, line_ids, true);
  }
  function applyLinesStyle(id) {
    const lines = dataStyleStore.styles[id].lines;
    for (const [line_id, style] of Object.entries(lines)) {
      setLineVisibility(id, [line_id], style.visibility);
    }
  }

  return {
    lineVisibility,
    setLinesDefaultStyle,
    setLineVisibility,
    applyLinesStyle,
  };
}

export default useLinesStyle;
