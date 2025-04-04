import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const lines_schemas = viewer_schemas.opengeodeweb_viewer.model.lines;

export function useLinesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function linesVisibility(id) {
    return dataStyleStore.styles[id].lines.visibility;
  }

  /** Actions **/
  function setLinesVisibility(id, visibility) {
    viewer_call(
      {
        schema: lines_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].lines.visibility = visibility;
          console.log(
            "setLinesVisibility",
            dataStyleStore.styles[id].lines.visibility
          );
        },
      }
    );
  }

  function applyLinesStyle(id, style) {
    setLinesVisibility(id, style.visibility);
  }

  return {
    linesVisibility,
    setLinesVisibility,
    applyLinesStyle,
  };
}

export default useLinesStyle;
