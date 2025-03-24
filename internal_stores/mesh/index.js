import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { getDefaultStyle } from "@/utils/default_styles";
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

  const objectVisibility = computed(
    (id) => dataStyleStore.styles[id].visibility
  );
  const selectedObjects = computed(() => {
    var selection = [];
    for (const [id, value] of Object.entries(dataStyleStore.styles)) {
      if (value.visibility == true) {
        selection.push(id);
      }
    }
    return selection;
  });

  function addDataStyle(id, geode_object) {
    dataStyleStore.styles[id] = getDefaultStyle(geode_object);
    applyDefaultStyle(id);
  }
  function setVisibility(id, visibility) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.mesh.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].visibility = visibility;
          console.log("setVisibility", dataStyleStore.styles[id].visibility);
        },
      }
    );
  }

  function applyDefaultStyle(id) {
    const id_style = dataStyleStore.styles[id];
    for (const [key, value] of Object.entries(id_style)) {
      if (key == "visibility") setVisibility(id, value);
      else if (key == "points") pointsStyleStore.applyPointsStyle(id, value);
      else if (key == "edges") edgesStyleStore.applyEdgesStyle(id, value);
      else if (key == "polygons")
        polygonsStyleStore.applyPolygonsStyle(id, value);
      else if (key == "polyhedra")
        polyhedraStyleStore.applyPolyhedraStyle(id, value);
    }
  }

  return {
    objectVisibility,
    selectedObjects,
    addDataStyle,
    setVisibility,
    applyDefaultStyle,
    ...useMeshPointsStyle(),
    ...useMeshEdgesStyle(),
    ...useMeshPolygonsStyle(),
    ...useMeshPolyhedraStyle(),
  };
}
