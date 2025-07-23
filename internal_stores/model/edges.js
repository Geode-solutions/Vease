import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const model_edges_schemas = viewer_schemas.opengeodeweb_viewer.model.edges;

export function useModelEdgesStyle() {
  const dataStyleStore = useDataStyleStore();

  function modelEdgesVisibility(id) {
    return dataStyleStore.styles[id].edges.visibility;
  }

  function setModelEdgesVisibility(id, visibility) {
    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }
    if (!dataStyleStore.styles[id].edges) {
      dataStyleStore.styles[id].edges = {};
    }

    viewer_call(
      {
        schema: model_edges_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].edges.visibility = visibility;
          console.log("setModelEdgesVisibility", visibility);
        },
      }
    );
  }

  function applyModelEdgesStyle(id, style) {
    setModelEdgesVisibility(id, style.visibility);
  }

  function setModelEdgesDefaultStyle(id) {
    setModelEdgesVisibility(id, false);
  }

  return {
    modelEdgesVisibility,
    setModelEdgesVisibility,
    applyModelEdgesStyle,
    setModelEdgesDefaultStyle,
  };
}
