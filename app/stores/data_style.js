import useDataStyleState from "../internal_stores/data_style_state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";
import useModelStyle from "../internal_stores/model/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  /** States **/
  const dataStyleState = useDataStyleState();
  const meshStyleStore = useMeshStyle();
  const modelStyleStore = useModelStyle();
  const dataBaseStore = useDataBaseStore();

  /** Actions **/
  function addDataStyle(id, geode_object, object_type) {
    dataStyleState.styles[id] = getDefaultStyle(geode_object);

    if (object_type === "mesh") {
      meshStyleStore.applyMeshDefaultStyle(id);
    } else if (object_type === "model") {
      modelStyleStore.setMeshComponentsDefaultStyle(id);
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

  function setModelEdgesVisibility(id, visibility) {
    modelStyleStore.setModelMeshComponentVisibility(
      id,
      "Edge",
      null,
      visibility
    );
  }

  function modelEdgesVisibility(id) {
    return modelStyleStore.modelMeshComponentVisibility(id, "Edge", null);
  }

  return {
    ...dataStyleState,
    addDataStyle,
    setVisibility,
    setModelEdgesVisibility,
    modelEdgesVisibility,
    ...meshStyleStore,
    ...modelStyleStore,
  };
});

export default useDataStyleStore;
