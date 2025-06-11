import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const model_points_schemas = viewer_schemas.opengeodeweb_viewer.model.points;

export function useModelPointsStyle() {
  const dataStyleStore = useDataStyleStore();

  function modelPointsVisibility(id, type) {
    return (
      dataStyleStore.styles[id]?.points?.visibility ??
      getDefaultStyle(type)?.points?.visibility ??
      false
    );
  }
  function modelPointsSize(id) {
    return dataStyleStore.styles[id]?.points?.size;
  }

  function setModelPointsVisibility(id, visibility) {
    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }
    if (!dataStyleStore.styles[id].points) {
      dataStyleStore.styles[id].points = {};
    }

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
    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }
    if (!dataStyleStore.styles[id].points) {
      dataStyleStore.styles[id].points = {};
    }

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

  function applyPointsStyle(id, style) {
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
    applyPointsStyle,
    setModelPointsDefaultStyle,
  };
}
