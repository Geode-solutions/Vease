import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const dataStyleStore = useDataStyleStore();

const pointsVisibility = computed((id) => {
  console.log("pointsVisibility", dataStyleStore);
  return dataStyleStore.styles[id].points.visibility;
});

function setPointsVisibility(id, visibility) {
  viewer_call(
    {
      schema: mesh_points_schemas.visibility,
      params: { id, visibility },
    },
    {
      response_function: () => {
        styles[id].points.visibility = visibility;
        console.log("setPointsVisibility", styles[id].points.visibility);
      },
    }
  );
}

function applyPointsStyle(id, style) {
  setPointsVisibility(id, style.visibility);
  // setPointsActiveColoring(id, style.coloring.active);
  // setPointsSize(id, style.size);
}

export { pointsVisibility, setPointsVisibility, applyPointsStyle };
