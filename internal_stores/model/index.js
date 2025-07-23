import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import { useSurfacesStyle } from "./surfaces.js";
import { useCornersStyle } from "./corners.js";
import { useBlocksStyle } from "./blocks.js";
import { useLinesStyle } from "./lines.js";
import { useModelEdgesStyle } from "./edges.js";
import { useModelPointsStyle } from "./points.js";

export default function useModelStyle() {
  /** States **/
  const dataBaseStore = useDataBaseStore();
  const dataStyleStore = useDataStyleStore();
  const cornersStyleStore = useCornersStyle();
  const linesStyleStore = useLinesStyle();
  const surfacesStyleStore = useSurfacesStyle();
  const blocksStyleStore = useBlocksStyle();
  const modelEdgesStore = useModelEdgesStyle();
  const modelPointsStore = useModelPointsStyle();

  /** Getters **/
  function modelVisibility(id) {
    return dataStyleStore.styles[id]?.visibility;
  }

  function visibleMeshComponents(id) {
    const visible_mesh_components = ref([]);
    const styles = dataStyleStore.styles[id];
    if (!styles) return visible_mesh_components;

    Object.entries(styles.corners || {}).forEach(([corner_id, style]) => {
      if (style.visibility) visible_mesh_components.value.push(corner_id);
    });

    Object.entries(styles.lines || {}).forEach(([line_id, style]) => {
      if (style.visibility) visible_mesh_components.value.push(line_id);
    });

    Object.entries(styles.surfaces || {}).forEach(([surface_id, style]) => {
      if (style.visibility) visible_mesh_components.value.push(surface_id);
    });

    Object.entries(styles.blocks || {}).forEach(([block_id, style]) => {
      if (style.visibility) visible_mesh_components.value.push(block_id);
    });

    return visible_mesh_components;
  }

  function modelMeshComponentVisibility(id, component_type, component_id) {
    switch (component_type) {
      case "Corner":
        return cornersStyleStore.cornerVisibility(id, component_id);
      case "Line":
        return linesStyleStore.lineVisibility(id, component_id);
      case "Surface":
        return surfacesStyleStore.surfaceVisibility(id, component_id);
      case "Block":
        return blocksStyleStore.blockVisibility(id, component_id);
      default:
        return false;
    }
  }

  function setModelVisibility(id, visibility) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.model.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].visibility = visibility;
          console.log("setModelVisibility", visibility);
        },
      }
    );
  }

  function setModelColor(id, color) {
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.model.color,
        params: { id, color },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].color = color;
          console.log("setModelColor", color);
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
    switch (component_type) {
      case "Corner":
        cornersStyleStore.setCornerVisibility(id, [component_id], visibility);
        break;
      case "Line":
        linesStyleStore.setLineVisibility(id, [component_id], visibility);
        break;
      case "Surface":
        surfacesStyleStore.setSurfaceVisibility(id, [component_id], visibility);
        break;
      case "Block":
        blocksStyleStore.setBlockVisibility(id, [component_id], visibility);
        break;
    }
  }

  function applyModelDefaultStyle(id) {
    const id_style = dataStyleStore.styles[id];
    for (const [key, value] of Object.entries(id_style)) {
      if (key === "visibility") setModelVisibility(id, value);
      else if (key === "edges") modelEdgesStore.applyModelEdgesStyle(id, value);
      else if (key === "points")
        modelPointsStore.applyModelPointsStyle(id, value);
    }
  }

  function setMeshComponentsDefaultStyle(id) {
    const { mesh_components } = dataBaseStore.itemMetaDatas(id);
    if ("Corner" in mesh_components)
      cornersStyleStore.setCornersDefaultStyle(id);
    if ("Line" in mesh_components) linesStyleStore.setLinesDefaultStyle(id);
    if ("Surface" in mesh_components)
      surfacesStyleStore.setSurfacesDefaultStyle(id);
    if ("Block" in mesh_components) blocksStyleStore.setBlocksDefaultStyle(id);
    modelEdgesStore.setModelEdgesDefaultStyle(id);
    modelPointsStore.setModelPointsDefaultStyle(id);
  }

  return {
    modelVisibility,
    visibleMeshComponents,
    modelMeshComponentVisibility,
    setModelVisibility,
    setModelColor,
    setModelMeshComponentVisibility,
    applyModelDefaultStyle,
    setMeshComponentsDefaultStyle,
    ...useSurfacesStyle(),
    ...useCornersStyle(),
    ...useBlocksStyle(),
    ...useLinesStyle(),
    ...useModelEdgesStyle(),
    ...useModelPointsStyle(),
  };
}
