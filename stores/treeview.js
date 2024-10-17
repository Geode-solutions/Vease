import { defineStore } from "pinia";

export const useTreeviewStore = defineStore("treeview", {
  state: () => ({
    selection: [],
    items: [],
  }),
  actions: {
    addFile(geodeObject, filename, id) {
      const child = { title: filename, id };
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
  },
});
