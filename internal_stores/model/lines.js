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
    const lines = dataBaseStore.db[id]?.mesh_components?.["Line"];
    if (!lines || lines.length === 0) return;

    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }

    if (!dataStyleStore.styles[id].lines) {
      dataStyleStore.styles[id].lines = {};
    }

    const line_ids = [];

    for (const line_id of lines) {
      dataStyleStore.styles[id].lines[line_id] = lineDefaultStyle(true);
      line_ids.push(line_id);
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
