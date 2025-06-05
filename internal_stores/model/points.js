import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const model_points_schemas =
  viewer_schemas.opengeodeweb_viewer.model["points.visibility"];

export function useModelPointsStyle() {
  const dataStyleStore = useDataStyleStore();

  function pointsVisibility(id) {
    return dataStyleStore.styles[id]?.points?.visibility ?? false;
  }
  function pointsSize(id) {
    return dataStyleStore.styles[id].points.size;
  }

  function setPointsVisibility(id, visibility) {
    viewer_call(
      {
        schema: model_points_schemas,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.visibility = visibility;
          console.log(
            "setPointsVisibility",
            dataStyleStore.styles[id].points.visibility
          );
        },
      }
    );
  }
  function setPointsSize(id, size) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.model.points.size,
        params: { id, size },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].points.size = size;
          console.log("setPointsSize", dataStyleStore.styles[id].points.size);
        },
      }
    );
  }

  function applyPointsStyle(id, style) {
    setPointsVisibility(id, false);
    setPointsSize(id, style.size);
  }

  return {
    pointsVisibility,
    pointsSize,
    setPointsVisibility,
    setPointsSize,
    applyPointsStyle,
  };
}
