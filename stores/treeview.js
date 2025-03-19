export const use_treeview_store = defineStore("treeview", () => {
  const dataStyleStore = useDataStyleStore();

  /** State **/
  const items = ref([]);
  const selection = ref([]);

  /** Getters **/

  /** Functions **/
  function addItem(
    geodeObject,
    displayed_name,
    id,
    object_type,
    native_filename
  ) {
    dataStyleStore.addDataStyle(id, geodeObject);
    const child = { title: displayed_name, id, object_type, native_filename };
    for (let i = 0; i < items.value.length; i++) {
      if (items.value[i].title === geodeObject) {
        items.value[i].children.push(child);
        selection.value.push(child);
        dataStyleStore.styles[id].visibility = true;
        return;
      }
    }
    items.value.push({ title: geodeObject, children: [child] });
    selection.value.push(child);
    dataStyleStore.styles[id].visibility = true;
  }
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

  return {
    items,
    selection,
    itemMetaDatas,
    addItem,
  };
});
