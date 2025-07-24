import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
const model_points_schemas = viewer_schemas.opengeodeweb_viewer.model.points;

export function useModelPointsStyle() {
  const dataStyleStore = useDataStyleStore();

  function modelPointsVisibility(id) {
    return dataStyleStore.styles[id].points.visibility;
  }
  function modelPointsSize(id) {
    return dataStyleStore.styles[id].points.size;
  }

  function setModelPointsVisibility(id, visibility) {
    viewer_call(
      {
        schema: model_points_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.visibility = visibility;
          console.log("setModelPointsVisibility", visibility);
        },
      }
    );
  }

  function setModelPointsSize(id, size) {
    viewer_call(
      {
        schema: model_points_schemas.size,
        params: { id, size },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.size = size;
          console.log("setModelPointsSize", size);
        },
      }
    );
  }

  function applyModelPointsStyle(id, style) {
    setModelPointsVisibility(id, style.visibility);
    setModelPointsSize(id, style.size);
  }

  function setModelPointsDefaultStyle(id) {
    setModelPointsVisibility(id, false);
  }

  return {
    modelPointsVisibility,
    modelPointsSize,
    setModelPointsVisibility,
    setModelPointsSize,
    applyModelPointsStyle,
    setModelPointsDefaultStyle,
  };
}
