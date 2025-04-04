import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import { useSurfacesStyle } from "./surfaces.js";
import { useCornersStyle } from "./corners.js";
import { useBlocksStyle } from "./blocks.js";
import { useLinesStyle } from "./lines.js";

export default function useModelStyle() {
  const dataStyleStore = useDataStyleStore();
  const surfacesStyleStore = useSurfacesStyle();
  const cornersStyleStore = useCornersStyle();
  const blocksStyleStore = useBlocksStyle();
  const linesStyleStore = useLinesStyle();

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

  function setModelVisibility(id, visibility) {
    console.log("setModelVisibility", id, visibility);
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.model.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].visibility = visibility;
          console.log(
            "setModelVisibility",
            dataStyleStore.styles[id].visibility
          );
        },
      }
    );
  }

  function applyModelDefaultStyle(id) {
    const id_style = dataStyleStore.styles[id];
    for (const [key, value] of Object.entries(id_style)) {
      if (key == "visibility") setModelVisibility(id, value);
      // else if (key == "surfaces")
      //   surfacesStyleStore.applySurfacesStyle(id, value);
      // else if (key == "corners") cornersStyleStore.applyCornersStyle(id, value);
      // else if (key == "blocks") blocksStyleStore.applyBlocksStyle(id, value);
      // else if (key == "lines") linesStyleStore.applyLinesStyle(id, value);
    }
  }

  function setMeshComponentVisibility(id, uuid, flat_index, visibility) {
    const meta_data = treeviewStore.itemMetaDatas(id);
    const object_type = meta_data.object_type;
    console.log("setVisibility", id, visibility, object_type);
    if (mesh_component_type == "Block") {
      blocksStyleStore.setBlocksVisibility(id, visibility);
    }
  }

  return {
    objectVisibility,
    selectedObjects,
    setModelVisibility,
    applyModelDefaultStyle,
    setMeshComponentVisibility,
    ...useSurfacesStyle(),
    ...useCornersStyle(),
    ...useBlocksStyle(),
    ...useLinesStyle(),
  };
}
