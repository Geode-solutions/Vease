export const use_treeview_store = defineStore("treeview", {
  state: () => ({
    selection: [],
    items: [],
  }),
  actions: {
    addFile(geodeObject, filename, id, object_type) {
      const child = { title: filename, id, object_type };
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].title === geodeObject) {
          this.items[i].children.push(child);
          this.selection.push(child);
          return;
        }
      }
      this.items.push({
        title: geodeObject,
        children: [child],
      });
      this.selection.push(child);
    },

    setSelectionType(type) {
      this.selectionType = type;
    },
    setSelection(selection) {
      this.selection = selection;
    },
    setItems(items) {
      this.items = items;
    },
    setDefaultSelection(defaultSelection) {
      this.selection = defaultSelection;
    },
    get_ids() {
      const ids = this.selection.map((item) => item.id);
      console.log("ids", ids);
      return ids;
    },

    idMetaData(id) {
      console.log("idMetaData", id);
      let object_type, geode_object;
      for (let i = 0; i < this.items.length; i++) {
        for (let j = 0; j < this.items[i].children.length; j++) {
          if (this.items[i].children[j].id === id) {
            geode_object = this.items[i].title;
            object_type = this.items[i].children[j].object_type;
          }
        }
      }
      return { object_type, geode_object };
    },
  },
});
