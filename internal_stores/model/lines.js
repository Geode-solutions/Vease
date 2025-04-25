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
  function setLineVisibility(id, line_id, visibility) {
    const flat_index = dataBaseStore.getFlatIndex(id, line_id);
    viewer_call(
      {
        schema: lines_schemas.visibility,
        params: { id, block_ids: [flat_index], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].lines[line_id].visibility = visibility;
          console.log(
            "setLineVisibility",
            dataStyleStore.styles[id].lines[line_id].visibility
          );
        },
      }
    );
  }

  function applyLinesStyle(id) {
    const lines = dataStyleStore.styles[id].lines;
    for (const [line_id, style] of Object.entries(lines)) {
      setLineVisibility(id, line_id, style.visibility);
    }
  }

  return {
    lineVisibility,
    setLineVisibility,
    applyLinesStyle,
  };
}

export default useLinesStyle;
