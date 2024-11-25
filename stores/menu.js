import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

export const useMenuStore = defineStore("menuStore", {
  state: () => ({
    items: [
      {
        title: "Option 1",
        icon: "mdi-microscope",
        visible: false,
        dialog: false,
      },
      {
        title: "Option 2",
        icon: "mdi-test-tube",
        visible: false,
        dialog: false,
      },
      { title: "Option 3", icon: "mdi-dna", visible: false, dialog: false },
      { title: "Option 4", icon: "mdi-flask", visible: false, dialog: false },
      { title: "Option 5", icon: "mdi-atom", visible: false, dialog: false },
      {
        title: "Option 6",
        icon: "mdi-axis-x-arrow",
        visible: false,
        dialog: false,
      },
      {
        title: "Option 7",
        icon: "mdi-alert-circle",
        visible: false,
        dialog: false,
      },
      { title: "Option 8", icon: "mdi-magnify", visible: false, dialog: false },
      {
        title: "Option 9",
        icon: "mdi-dots-vertical",
        visible: false,
        dialog: false,
      },
      {
        title: "Option 10",
        icon: "mdi-dots-horizontal",
        visible: false,
        dialog: false,
      },
    ],
    menu: false,
  }),
  actions: {
    closeMenu() {
      this.menu = false;
      this.items.forEach((item) => {
        item.visible = false;
        item.dialog = false;
      });
    },

    openMenu(x, y) {
      const treeview_store = useTreeviewStore();
      this.closeMenu();

      const ids = treeview_store.get_ids();
      console.log("from openMenu x y", x, y);

      console.log("from openMenu ids", ids);

      viewer_call(
        {
          schema: viewer_schemas.opengeodeweb_viewer.get_mouse_menu,
          params: { x, y, ids },
        },
        {
          response_function: (response) => {
            console.log("from openMenu response", response);

            const id = response;
            console.log("from openMenu id", id);
            console.log("treeview_store.items", treeview_store.items);
            let geode_object;
            for (let i = 0; i < treeview_store.items.length; i++) {
              for (
                let j = 0;
                j < treeview_store.items[i].children.length;
                j++
              ) {
                if (treeview_store.items[i].children[j].id === id) {
                  geode_object = treeview_store.items[i].title;
                  // return;
                }
              }
            }

            console.log("final geode_object", geode_object);
          },
        }
      );

      setTimeout(() => {
        this.menu = true;
        this.showItemsWithDelay();
      }, 0);
    },
    showItemsWithDelay() {
      const DELAY = 50;
      this.items.forEach((item, index) => {
        setTimeout(() => {
          item.visible = true;
        }, index * DELAY);
      });
    },

    handleClick(item) {
      console.log(`Clicked on ${item.title}`);
      this.closeMenu();
    },
  },
});
