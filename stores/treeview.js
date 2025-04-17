export const use_treeview_store = defineStore("treeview", () => {
  const dataStyleStore = useDataStyleStore();

  /** State **/
  const items = ref([]);
  const selection = ref([]);
  const components_selection = ref([]);
  const isAdditionnalTreeDisplayed = ref(false);
  const panelWidth = ref(300);
  const modelUuids = ref({});
  const model_id = ref("");
  const isTreeCollection = ref(false);
  const selectedTree = ref(null);

  /** Get item metadata by ID **/
  function itemMetaDatas(id) {
    for (let i = 0; i < items.value.length; i++) {
      for (let j = 0; j < items.value[i].children.length; j++) {
        if (items.value[i].children[j].id === id) {
          const geode_object = items.value[i].title;
          const object_type = items.value[i].children[j].object_type;
          const displayed_name = items.value[i].children[j].title;
          const native_filename = items.value[i].children[j].native_filename;
          return {
            object_type,
            geode_object,
            displayed_name,
            native_filename,
          };
        }
      }
    }
    return null;
  }
  /** Functions **/
  function addItem(
    geodeObject,
    displayed_name,
    id,
    object_type,
    native_filename
  ) {
    console.log("ADD ITEM");
    dataStyleStore.addDataStyle(id, geodeObject, object_type);
    const child = { title: displayed_name, id, object_type, native_filename };
    for (let i = 0; i < items.value.length; i++) {
      if (items.value[i].title === geodeObject) {
        items.value[i].children.push(child);
        selection.value.push(child);
        return;
      }
    }
    items.value.push({ title: geodeObject, children: [child] });
    selection.value.push(child);
  }

  function setModelUuids(uuids) {
    modelUuids.value = uuids;
  }

  function displayAdditionalTree(id) {
    isAdditionnalTreeDisplayed.value = true;
    model_id.value = id;
    console.log("model_id.value", model_id.value);
  }

  function displayFileTree() {
    isAdditionnalTreeDisplayed.value = false;
  }

  function toggleTreeView() {
    isTreeCollection.value = !isTreeCollection.value;
    console.log(
      "Switched to",
      isTreeCollection.value ? "TreeCollection" : "TreeComponent"
    );
  }

  function setPanelWidth(width) {
    panelWidth.value = width;
  }

  return {
    items,
    selection,
    components_selection,
    isAdditionnalTreeDisplayed,
    panelWidth,
    modelUuids,
    model_id,
    selectedTree,
    itemMetaDatas,
    addItem,
    setModelUuids,
    displayAdditionalTree,
    displayFileTree,
    toggleTreeView,
    setPanelWidth,
  };
});
