import useDataStyleState from "~/internal_stores/data_style_state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";
import useModelStyle from "../internal_stores/model/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  /** States **/
  const dataStyleStore = useDataStyleStore();
  const meshStyleStore = useMeshStyle();
  const modelStyleStore = useModelStyle();
  const dataBaseStore = useDataBaseStore();

  /** Actions **/
  function addDataStyle(id, geode_object, object_type) {
    console.log("addDataStyle", id, geode_object, object_type);
    dataStyleStore.styles[id] = getDefaultStyle(geode_object);
    if (object_type == "mesh") {
      meshStyleStore.applyMeshDefaultStyle(id);
    } else if (object_type == "model") {
      modelStyleStore.applyModelDefaultStyle(id);
    }
  }

  function setVisibility(id, visibility) {
    const object_type = dataBaseStore.itemMetaDatas(id).object_type;
    if (object_type === "mesh") {
      meshStyleStore.setMeshVisibility(id, visibility);
    } else if (object_type === "model") {
      modelStyleStore.setModelVisibility(id, visibility);
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
