import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { getDefaultStyle } from "@/utils/default_styles";
import { usePointsStyle } from "./points.js";
import useState from "~/internal_stores/state.js";
import _ from "lodash";

export default function useMeshStyle() {
  const { styles } = useState();

  console.log("styles", styles);

  const objectVisibility = computed((id) => styles.value[id].visibility);
  const selectedObjects = computed(() => {
    var selection = [];
    for (const [id, value] of Object.entries(styles.value)) {
      if (value.visibility == true) {
        selection.push(id);
      }
    }
    return selection;
  });

  function addDataStyle(id, geode_object) {
    styles.value[id] = getDefaultStyle(geode_object);
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
          styles.value[id].visibility = visibility;
          console.log("setVisibility", styles.value[id].visibility);
        },
      }
    );
  }

  function applyDefaultStyle(id) {
    console.log("applyDefaultStyle [id]", styles.value[id]);

    const style = styles.value[id];
    console.log("applyDefaultStyle", style);
    for (const [key, value] of Object.entries(style)) {
      if (key == "visibility") setVisibility(id, value);
      else if (key == "points") usePointsStyle().applyPointsStyle(id, value);
      // else if (key == "edges") this.applyEdgesStyle(id, value);
      // else if (key == "polygons") this.applyPolygonsStyle(id, value);
      // else if (key == "polyhedrons") this.applyPolyhedronsStyle(id, value);
    }
  }

  return {
    objectVisibility,
    selectedObjects,
    addDataStyle,
    setVisibility,
    applyDefaultStyle,
    ...usePointsStyle(),
  };
}
