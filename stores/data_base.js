import back_schemas from "@geode/opengeodeweb-back/schemas.json";

export const useDataBaseStore = defineStore("dataBase", () => {
  const treeview_store = use_treeview_store();

  /** State **/
  const db = ref({});

  /** Getters **/
  function itemMetaData(id) {
    return db.value[id];
  }

  function formatedMeshComponents(id) {
    console.log("formatedMeshComponents id", id);
    var formated_mesh_components = ref([]);
    console.log("formatedMeshComponents db.value[id]", db.value[id]);
    for (const [category, uuids] of Object.entries(
      db.value[id].mesh_components
    )) {
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
      db.value[id].mesh_components_selection = [];
    }
    treeview_store.addItem(
      value.geode_object,
      value.displayed_name,
      id,
      value.object_type
    );
  }

  function itemMetaDatas(id) {
    return db.value[id];
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
          db.value[id].mesh_components = response._data.uuid_dict;
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

  function getFlatIndexes(id, mesh_component_ids) {
    console.log("getFlatIndexes", id, mesh_component_ids, db.value);
    var flat_indexes = [];
    for (const mesh_component_id of mesh_component_ids)
      flat_indexes.push(db.value[id]["uuid_to_flat_index"][mesh_component_id]);
    console.log("flat_indexes", flat_indexes);
    return flat_indexes;
  }

  return {
    db,
    itemMetaData,
    formatedMeshComponents,
    addItem,
    itemMetaDatas,
    fetchUuidToFlatIndexDict,
    fetchMeshComponents,
    getFlatIndexes,
  };
});
