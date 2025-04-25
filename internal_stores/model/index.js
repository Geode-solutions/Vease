import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { useSurfacesStyle } from "./surfaces.js";
import { useCornersStyle } from "./corners.js";
import { useBlocksStyle } from "./blocks.js";
import { useLinesStyle } from "./lines.js";

export default function useModelStyle() {
  /** States **/
  const dataStyleStore = useDataStyleStore();
  const surfacesStyleStore = useSurfacesStyle();
  const cornersStyleStore = useCornersStyle();
  const blocksStyleStore = useBlocksStyle();
  const linesStyleStore = useLinesStyle();

  /** Getters **/
  function modelVisibility(id) {
    return dataStyleStore.styles[id].visibility;
  }
  function modelMeshComponentVisibility(id, component_type, component_id) {
    if (component_type == "Corner") {
      return cornersStyleStore.cornerVisibility(id, component_id);
    } else if (component_type == "Line") {
      linesStyleStore.lineVisibility(id, component_id);
    } else if (component_type == "Surface") {
      surfacesStyleStore.surfaceVisibility(id, component_id);
    } else if (component_type == "Block") {
      blocksStyleStore.blockVisibility(id, component_id);
    }
  }
  /** Actions **/
  function setModelVisibility(id, visibility) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.model.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].visibility = visibility;
        },
      }
    );
  }

  function setModelMeshComponentVisibility(
    id,
    component_type,
    component_id,
    visibility
  ) {
    if (component_type == "Corner") {
      cornersStyleStore.setCornerVisibility(id, component_id, visibility);
    } else if (component_type == "Line") {
      linesStyleStore.setLineVisibility(id, component_id, visibility);
    } else if (component_type == "Surface") {
      surfacesStyleStore.setSurfaceVisibility(id, component_id, visibility);
    } else if (component_type == "Block") {
      blocksStyleStore.setBlockVisibility(id, component_id, visibility);
    }
  }

  function applyModelDefaultStyle(id) {
    console.log("applyModelDefaultStyle", id);
    const id_style = dataStyleStore.styles[id];
    console.log("id_style", id_style);

    for (const [key, value] of Object.entries(id_style)) {
      if (key == "visibility") setModelVisibility(id, value);
      else if (key == "corners") cornersStyleStore.applyCornersStyle(id);
      else if (key == "lines") linesStyleStore.applyLinesStyle(id);
      else if (key == "surfaces") surfacesStyleStore.applySurfacesStyle(id);
      else if (key == "blocks") blocksStyleStore.applyBlocksStyle(id);
    }
  }

  return {
    modelVisibility,
    modelMeshComponentVisibility,
    setModelVisibility,
    setModelMeshComponentVisibility,
    applyModelDefaultStyle,
    ...useSurfacesStyle(),
    ...useCornersStyle(),
    ...useBlocksStyle(),
    ...useLinesStyle(),
  };
}
