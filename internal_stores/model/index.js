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
          console.log("setModelVisibility", dataStyleStore.styles[id].visibility);
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
          console.log("setModelColor", dataStyleStore.styles[id].color);
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
    for (const [key, value] of Object.entries(id_style)) {
      if (key == "visibility") setModelVisibility(id, value);
      else if (key == "color") setModelColor(id, value);
    }
  }

  function setMeshComponentsDefaultStyle(id) {
    cornersStyleStore.setCornersDefaultStyle(id);
    linesStyleStore.setLinesDefaultStyle(id);
    surfacesStyleStore.setSurfacesDefaultStyle(id);
    blocksStyleStore.setBlocksDefaultStyle(id);
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
  };
}
