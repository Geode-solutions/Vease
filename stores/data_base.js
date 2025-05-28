import back_schemas from "@geode/opengeodeweb-back/schemas.json";

export const useDataBaseStore = defineStore("dataBase", () => {
  const treeview_store = use_treeview_store();
  const frontViewer_store = useFrontViewerStore();

  /** State **/
  const db = reactive({});

  /** Getters **/
  function itemMetaData(id) {
    return db.value[id] || {};
  }

  function formatedMeshComponents(id) {
    const formated_mesh_components = ref([]);

    if (!db.value[id] || !db.value[id].mesh_components) {
      return formated_mesh_components.value;
    }

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

  function meshComponentType(id, uuid) {
    if (!db.value[id] || !db.value[id].mesh_components) {
      return null;
    }

    if (db.value[id].mesh_components["Corner"]?.includes(uuid)) return "corner";
    else if (db.value[id].mesh_components["Line"]?.includes(uuid))
      return "line";
    else if (db.value[id].mesh_components["Surface"]?.includes(uuid))
      return "surface";
    else if (db.value[id].mesh_components["Block"]?.includes(uuid))
      return "block";
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
    console.log("dataBase addItem value", value);
    console.log("db.value before", db);
    db[id] = value;
    console.log("db.value after", db);

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

    frontViewer_store.addItem(id, value.vtk_js);
  }

  function itemMetaDatas(id) {
    return db.value[id] || {};
  }

  async function fetchMeshComponents(id) {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.mesh_components,
        params: {
          filename: db.value[id]?.native_filename,
          geode_object: db.value[id]?.geode_object,
        },
      },
      {
        response_function: async (response) => {
          if (response._data?.uuid_dict) {
            db.value[id].mesh_components = response._data.uuid_dict;
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
            db.value[id]["uuid_to_flat_index"] =
              response._data.uuid_to_flat_index;
          }
        },
      }
    );
  }

  function getFlatIndexes(id, mesh_component_ids) {
    if (!db.value[id] || !db.value[id]["uuid_to_flat_index"]) {
      return [];
    }

    const flat_indexes = mesh_component_ids.map(
      (mesh_component_id) =>
        db.value[id]["uuid_to_flat_index"][mesh_component_id] || null
    );
    return flat_indexes.filter((index) => index !== null);
  }

  return {
    db,
    itemMetaData,
    meshComponentType,
    formatedMeshComponents,
    addItem,
    itemMetaDatas,
    fetchUuidToFlatIndexDict,
    fetchMeshComponents,
    getFlatIndexes,
  };
});
