import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

export const useDataBaseStore = defineStore("dataBase", () => {
  const treeview_store = use_treeview_store();
  const hybridViewerStore = useHybridViewerStore();

  /** State **/
  const db = reactive({});

  /** Getters **/
  function itemMetaDatas(id) {
    return db[id];
  }

  function formatedMeshComponents(id) {
    const { mesh_components } = itemMetaDatas(id);
    const formated_mesh_components = ref([]);

    for (const [category, uuids] of Object.entries(mesh_components)) {
      formated_mesh_components.value.push({
        id: category,
        title: category,
        children: uuids.map((uuid) => ({
          id: uuid,
          title: uuid,
          category,
        })),
      });
    }
    return formated_mesh_components.value;
  }

  function meshComponentType(id, uuid) {
    const { mesh_components } = itemMetaDatas(id);

    if (mesh_components["Corner"]?.includes(uuid)) return "corner";
    else if (mesh_components["Line"]?.includes(uuid)) return "line";
    else if (mesh_components["Surface"]?.includes(uuid)) return "surface";
    else if (mesh_components["Block"]?.includes(uuid)) return "block";
    return null;
  }

  /** Actions **/
  async function addItem(
    id,
    value = {
      object_type,
      geode_object,
      native_filename,
      viewable_filename,
      displayed_name,
      vtk_js: { binary_light_viewable },
    }
  ) {
    db[id] = value;

    if (value.object_type === "model") {
      await fetchMeshComponents(id);
      await fetchUuidToFlatIndexDict(id);
    }
    treeview_store.addItem(
      value.geode_object,
      value.displayed_name,
      id,
      value.object_type
    );

    hybridViewerStore.addItem(id, value.vtk_js);
  }

  async function fetchMeshComponents(id) {
    const { native_filename, geode_object } = itemMetaDatas(id);
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.mesh_components,
        params: {
          filename: native_filename,
          geode_object,
        },
      },
      {
        response_function: async (response) => {
          if (response._data?.uuid_dict) {
            db[id].mesh_components = response._data.uuid_dict;
          }
        },
      }
    );
  }

  async function fetchUuidToFlatIndexDict(id) {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.vtm_component_indices,
        params: { id },
      },
      {
        response_function: async (response) => {
          if (response._data?.uuid_to_flat_index) {
            db[id]["uuid_to_flat_index"] = response._data.uuid_to_flat_index;
          }
        },
      }
    );
  }

  function getCornersUuids(id) {
    const { mesh_components } = itemMetaDatas(id);
    return Object.values(mesh_components["Corner"]);
  }

  function getLinesUuids(id) {
    const { mesh_components } = itemMetaDatas(id);
    return Object.values(mesh_components["Line"]);
  }
  function getSurfacesUuids(id) {
    const { mesh_components } = itemMetaDatas(id);
    return Object.values(mesh_components["Surface"]);
  }
  function getBlocksUuids(id) {
    const { mesh_components } = itemMetaDatas(id);
    return Object.values(mesh_components["Block"]);
  }

  function getFlatIndexes(id, mesh_component_ids) {
    const { uuid_to_flat_index } = itemMetaDatas(id);

    const flat_indexes = mesh_component_ids.map(
      (mesh_component_id) => uuid_to_flat_index[mesh_component_id] || null
    );
    return flat_indexes.filter((index) => index !== null);
  }

  return {
    db,
    itemMetaDatas,
    meshComponentType,
    formatedMeshComponents,
    addItem,
    fetchUuidToFlatIndexDict,
    fetchMeshComponents,
    getCornersUuids,
    getLinesUuids,
    getSurfacesUuids,
    getBlocksUuids,
    getFlatIndexes,
  };
});
