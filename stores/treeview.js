export const use_treeview_store = defineStore("treeview", {
  state: () => ({
    items: [],
    selection: [],
  }),
  getters: {
    itemMetaDatas: (state) => {
      return (id) => {
        for (let i = 0; i < state.items.length; i++) {
          for (let j = 0; j < state.items[i].children.length; j++) {
            if (state.items[i].children[j].id === id) {
              const geode_object = state.items[i].title;
              const object_type = state.items[i].children[j].object_type;
              const displayed_name = state.items[i].children[j].title;
              const native_filename = state.items[i].children[j].native_filename;
              console.log("itemMetaDatas", geode_object, object_type, displayed_name, native_filename);
              return { object_type, geode_object, displayed_name, native_filename };
            }
          }
        }
        return null;
      };
    },
  },
  actions: {
    addItem(geodeObject, displayed_name, id, object_type, native_filename) {
      const dataStyleStore = useDataStyleStore();
      dataStyleStore.addDataStyle(id, geodeObject);
      const child = { title: displayed_name, id, object_type, native_filename };
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].title === geodeObject) {
          this.items[i].children.push(child);
          console.log("this.items[i].children", this.items[i].children);
          this.selection.push(child);
          dataStyleStore.styles[id].visibility = true;
          return;
        }
      }
      this.items.push({ title: geodeObject, children: [child] });
      this.selection.push(child);
      console.log("this.items", this.items);
      dataStyleStore.styles[id].visibility = true;
    },
  },
});
