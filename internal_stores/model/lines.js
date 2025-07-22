import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const lines_schemas = viewer_schemas.opengeodeweb_viewer.model.lines;

export function useLinesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();
  const dataBaseStore = useDataBaseStore();

  /** Getters **/
  function lineVisibility(id, line_id) {
    return dataStyleStore.styles[id].lines[line_id].visibility;
  }

  function linesColor(id) {
    return dataStyleStore.styles[id].lines.color;
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
          for (const line_id of line_ids) {
            if (!dataStyleStore.styles[id].lines[line_id])
              dataStyleStore.styles[id].lines[line_id] = {};
            dataStyleStore.styles[id].lines[line_id].visibility = visibility;
          }
          console.log("setLineVisibility", line_ids, visibility);
        },
      }
    );
  }

  function setLineColor(id, line_ids, color) {
    const line_flat_indexes = dataBaseStore.getFlatIndexes(id, line_ids);
    viewer_call(
      {
        schema: lines_schemas.color,
        params: { id, block_ids: line_flat_indexes, color },
      },
      {
        response_function: () => {
          for (const line_id of line_ids) {
            if (!dataStyleStore.styles[id].lines[line_id])
              dataStyleStore.styles[id].lines[line_id] = {};
            dataStyleStore.styles[id].lines[line_id].color = color;
          }
          console.log("setLineColor", line_ids, color);
        },
      }
    );
  }

  function setLinesDefaultStyle(id) {
    const line_ids = dataBaseStore.getLinesUuids(id);
    setLineVisibility(id, line_ids, dataStyleStore.styles[id].lines.visibility);
    setLineColor(id, line_ids, dataStyleStore.styles[id].lines.color);
  }

  function applyLinesStyle(id) {
    const lines = dataStyleStore.styles[id].lines;
    for (const [line_id, style] of Object.entries(lines)) {
      setLineVisibility(id, [line_id], style.visibility);
    }
  }

  return {
    lineVisibility,
    linesColor,
    setLinesDefaultStyle,
    setLineVisibility,
    applyLinesStyle,
  };
}

export default useLinesStyle;
