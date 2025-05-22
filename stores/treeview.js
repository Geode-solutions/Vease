export const use_treeview_store = defineStore("treeview", () => {
  const dataStyleStore = useDataStyleStore();

  /** State **/
  const items = ref([]);
  const selection = ref([]);
  const components_selection = ref([]);
  const isAdditionnalTreeDisplayed = ref(false);
  const panelWidth = ref(300);
  const model_id = ref("");
  const isTreeCollection = ref(false);
  const selectedTree = ref(null);

  /** Functions **/
  function addItem(geodeObject, displayed_name, id, object_type) {
    dataStyleStore.addDataStyle(id, geodeObject, object_type);
    const child = { title: displayed_name, id, object_type };
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

  function displayAdditionalTree(id) {
    isAdditionnalTreeDisplayed.value = true;
    model_id.value = id;
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
    model_id,
    selectedTree,
    addItem,
    displayAdditionalTree,
    displayFileTree,
    toggleTreeView,
    setPanelWidth,
  };
});
