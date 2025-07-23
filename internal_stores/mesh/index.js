import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import { useMeshPointsStyle } from "./points.js";
import { useMeshEdgesStyle } from "./edges.js";
import { useMeshPolygonsStyle } from "./polygons.js";
import { useMeshPolyhedraStyle } from "./polyhedra.js";

export default function useMeshStyle() {
  const dataStyleStore = useDataStyleStore();
  const pointsStyleStore = useMeshPointsStyle();
  const edgesStyleStore = useMeshEdgesStyle();
  const polygonsStyleStore = useMeshPolygonsStyle();
  const polyhedraStyleStore = useMeshPolyhedraStyle();

  function setMeshVisibility(id, visibility) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].visibility = visibility;
          console.log(
            "setMeshVisibility",
            dataStyleStore.styles[id].visibility
          );
        },
      }
    );
  }

  function applyMeshDefaultStyle(id) {
    const id_style = dataStyleStore.styles[id];
    for (const [key, value] of Object.entries(id_style)) {
      if (key == "visibility") setMeshVisibility(id, value);
      else if (key == "points") pointsStyleStore.applyPointsStyle(id, value);
      else if (key == "edges") edgesStyleStore.applyEdgesStyle(id, value);
      else if (key == "polygons")
        polygonsStyleStore.applyPolygonsStyle(id, value);
      else if (key == "polyhedra")
        polyhedraStyleStore.applyPolyhedraStyle(id, value);
    }
  }

  return {
    setMeshVisibility,
    applyMeshDefaultStyle,
    ...useMeshPointsStyle(),
    ...useMeshEdgesStyle(),
    ...useMeshPolygonsStyle(),
    ...useMeshPolyhedraStyle(),
  };
}
