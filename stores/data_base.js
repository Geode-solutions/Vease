import back_schemas from "@geode/opengeodeweb-back/schemas.json";

export const useDataBaseStore = defineStore("dataBase", () => {
  const treeview_store = use_treeview_store();

  /** State **/
  const db = ref({});

  /** Getters **/
  function itemMetaData(id) {
    return db.value[id];
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
    }
  ) {
    db.value[id] = value;
    if (value.object_type == "model") {
      await fetchMeshComponents(id);
      await fetchUuidToFlatIndexDict(id);
    }
    treeview_store.addItem(
      value.geode_object,
      value.displayed_name,
      id,
      value.object_type
    );
  }

  async function fetchMeshComponents(id) {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.mesh_components,
        params: {
          filename: db.value[id].native_filename,
          geode_object: db.value[id].geode_object,
        },
      },
      {
        response_function: async (response) => {
          db.value[id]["mesh_components"] = response._data.uuid_dict;
        },
      }
    );
  }

  async function fetchUuidToFlatIndexDict(id) {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.vtm_component_indices,
        params: {
          id,
        },
      },
      {
        response_function: async (response) => {
          db.value[id]["uuid_to_flat_index"] =
            response._data.uuid_to_flat_index;
        },
      }
    );
  }

  function getFlatIndex(id, mesh_component_id) {
    console.log("getFlatIndex", id, db.value);
    return db.value[id]["uuid_to_flat_index"][mesh_component_id];
  }

  return {
    db,
    itemMetaData,
    addItem,
    fetchUuidToFlatIndexDict,
    fetchMeshComponents,
    getFlatIndex,
  };
});
