import useDataStyleState from "~/internal_stores/data_style_state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";
import useModelStyle from "../internal_stores/model/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  const dataStyleStore = useDataStyleStore();
  const meshStyleStore = useMeshStyle();
  const modelStyleStore = useModelStyle();
  const treeviewStore = use_treeview_store();

  function addDataStyle(id, geode_object, object_type) {
    dataStyleStore.styles[id] = getDefaultStyle(geode_object);
    if (object_type == "mesh") {
      meshStyleStore.applyMeshDefaultStyle(id);
    } else if (object_type == "model") {
      modelStyleStore.applyModelDefaultStyle(id);
    }
  }

  function setVisibility(id, flat_index_or_bool, visibility_opt) {
    const meta_data = treeviewStore.itemMetaDatas(id);
    const object_type = meta_data.object_type;

    if (object_type === "mesh") {
      meshStyleStore.setMeshVisibility(id, flat_index_or_bool); // flat_index_or_bool == visibility (bool)
    } else if (object_type === "model") {
      const flat_index = flat_index_or_bool;
      const visibility = visibility_opt;
      modelStyleStore.setSurfaceBlockVisibility(id, flat_index, visibility);
    }
  }

  return {
    ...useDataStyleState(),
    addDataStyle,
    setVisibility,
    ...useMeshStyle(),
    ...useModelStyle(),
  };
});

export default useDataStyleStore;
