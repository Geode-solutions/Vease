import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { useSurfacesStyle } from "./surfaces.js";
import { useCornersStyle } from "./corners.js";
import { useBlocksStyle } from "./blocks.js";
import { useLinesStyle } from "./lines.js";

export default function useModelStyle() {
  /** States **/
  const dataStyleStore = useDataStyleStore();
  const cornersStyleStore = useCornersStyle();
  const linesStyleStore = useLinesStyle();
  const surfacesStyleStore = useSurfacesStyle();
  const blocksStyleStore = useBlocksStyle();

  /** Getters **/
  function modelVisibility(id) {
    return dataStyleStore.styles[id]?.visibility;
  }

  function visibleMeshComponents(id) {
    const visible_mesh_components = ref([]);

    const styles = dataStyleStore.styles[id];
    if (!styles) return visible_mesh_components;

    if (styles.corners) {
      for (const [corner_id, style] of Object.entries(styles.corners)) {
        if (style.visibility === true) {
          visible_mesh_components.value.push(corner_id);
        }
      }
    }

    if (styles.lines) {
      for (const [line_id, style] of Object.entries(styles.lines)) {
        if (style.visibility === true) {
          visible_mesh_components.value.push(line_id);
        }
      }
    }

    if (styles.surfaces) {
      for (const [surface_id, style] of Object.entries(styles.surfaces)) {
        if (style.visibility === true) {
          visible_mesh_components.value.push(surface_id);
        }
      }
    }

    if (styles.blocks) {
      for (const [block_id, style] of Object.entries(styles.blocks)) {
        if (style.visibility === true) {
          visible_mesh_components.value.push(block_id);
        }
      }
    }

    return visible_mesh_components;
  }

  function setMeshComponentsDefaultStyle(id) {
    cornersStyleStore.setCornersDefaultStyle(id);
    linesStyleStore.setLinesDefaultStyle(id);
    surfacesStyleStore.setSurfacesDefaultStyle(id);
    blocksStyleStore.setBlocksDefaultStyle(id);
  }

  function modelMeshComponentVisibility(id, component_type, component_id) {
    if (component_type === "Corner") {
      return cornersStyleStore.cornerVisibility(id, component_id);
    } else if (component_type === "Line") {
      return linesStyleStore.lineVisibility(id, component_id);
    } else if (component_type === "Surface") {
      return surfacesStyleStore.surfaceVisibility(id, component_id);
    } else if (component_type === "Block") {
      return blocksStyleStore.blockVisibility(id, component_id);
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
    if (component_type === "Corner") {
      cornersStyleStore.setCornerVisibility(id, [component_id], visibility);
    } else if (component_type === "Line") {
      linesStyleStore.setLineVisibility(id, [component_id], visibility);
    } else if (component_type === "Surface") {
      surfacesStyleStore.setSurfaceVisibility(id, [component_id], visibility);
    } else if (component_type === "Block") {
      blocksStyleStore.setBlockVisibility(id, [component_id], visibility);
    }
  }

  function applyModelDefaultStyle(id) {
    const id_style = dataStyleStore.styles[id];
    if (!id_style) return;

    if ("visibility" in id_style) setModelVisibility(id, id_style.visibility);
    if ("corners" in id_style) cornersStyleStore.setCornersDefaultStyle(id);
    if ("lines" in id_style) linesStyleStore.setLinesDefaultStyle(id);
    if ("surfaces" in id_style) surfacesStyleStore.setSurfacesDefaultStyle(id);
    if ("blocks" in id_style) blocksStyleStore.setBlocksDefaultStyle(id);
  }

  return {
    modelVisibility,
    visibleMeshComponents,
    setMeshComponentsDefaultStyle,
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
