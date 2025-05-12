import useDataStyleState from "~/internal_stores/data_style_state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";
import useModelStyle from "../internal_stores/model/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  /** States **/
  const dataStyleState = useDataStyleState();
  const meshStyleStore = useMeshStyle();
  const modelStyleStore = useModelStyle();
  const dataBaseStore = useDataBaseStore();

  const visibleMeshComponentIds = ref({});

  /** Actions **/
  function addDataStyle(id, geode_object, object_type) {
    console.log("addDataStyle", id, geode_object, object_type);
    dataStyleState.styles[id] = getDefaultStyle(geode_object);

    if (object_type === "mesh") {
      meshStyleStore.applyMeshDefaultStyle(id);

      const meshComponents = dataBaseStore.formatedMeshComponents(id);
      const allComponentIds = meshComponents.flatMap((category) =>
        category.children.map((child) => child.id)
      );
      visibleMeshComponentIds.value[id] = allComponentIds;
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

  function setInitialVisibleMeshComponents(meshId, components) {
    visibleMeshComponentIds.value[meshId] = components.map((c) => c.id);
  }

  function getVisibleMeshComponents(meshId) {
    return visibleMeshComponentIds.value[meshId] || [];
  }

  function updateVisibleMeshComponents(meshId, componentIds) {
    visibleMeshComponentIds.value[meshId] = componentIds;
  }

  return {
    ...dataStyleState,
    addDataStyle,
    setVisibility,
    ...meshStyleStore,
    ...modelStyleStore,
    visibleMeshComponentIds,
    setInitialVisibleMeshComponents,
    getVisibleMeshComponents,
    updateVisibleMeshComponents,
  };
});

export default useDataStyleStore;
