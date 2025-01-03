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
              const filename = state.items[i].children[j].title;
              return { object_type, geode_object, filename };
            }
          }
        }
        return null;
      };
    },
  },
  actions: {
    addItem(geodeObject, filename, id, object_type) {
      const dataStyleStore = useDataStyleStore();
      dataStyleStore.addDataStyle(id, geodeObject);
      const child = { title: filename, id, object_type };
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].title === geodeObject) {
          this.items[i].children.push(child);
          this.selection.push(child);
          dataStyleStore.styles[id].visibility = true;
          return;
        }
      }
      this.items.push({ title: geodeObject, children: [child] });
      this.selection.push(child);
      dataStyleStore.styles[id].visibility = true;
    },
  },
});
