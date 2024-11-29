import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

export const useMenuStore = defineStore("menuStore", {
  state: () => ({
    items: [
      {
        title: "Option 1",
        icon: "mdi-microscope",
        visible: false,
        dialog: false,
        contentType: "card",
        content: {
          title: "Card Title 1",
          text: "Content for Option 1",
        },
      },
      {
        title: "Option 2",
        icon: "mdi-test-tube",
        visible: false,
        dialog: false,
        contentType: "text",
        content: {
          text: "This is some text for Option 2",
        },
      },
      {
        title: "Option 3",
        icon: "mdi-dna",
        visible: false,
        dialog: false,
        contentType: "colorpicker",
        content: {
          color: "#ff0000",
        },
      },
      {
        title: "Option 4",
        icon: "mdi-flask",
        visible: false,
        dialog: false,
        contentType: "card",
        content: {
          title: "Card Title 4",
          text: "Content for Option 4",
        },
      },
      {
        title: "Option 5",
        icon: "mdi-atom",
        visible: false,
        dialog: false,
        contentType: "text",
        content: {
          text: "This is some text for Option 5",
        },
      },
      {
        title: "Option 6",
        icon: "mdi-axis-x-arrow",
        visible: false,
        dialog: false,
        contentType: "colorpicker",
        content: {
          color: "#00ff00",
        },
      },
      {
        title: "Option 7",
        icon: "mdi-alert-circle",
        visible: false,
        dialog: false,
        contentType: "card",
        content: {
          title: "Card Title 7",
          text: "Content for Option 7",
        },
      },
      {
        title: "Option 8",
        icon: "mdi-magnify",
        visible: false,
        dialog: false,
        contentType: "text",
        content: {
          text: "This is some text for Option 8",
        },
      },
      {
        title: "Option 9",
        icon: "mdi-dots-vertical",
        visible: false,
        dialog: false,
        contentType: "colorpicker",
        content: {
          color: "#0000ff",
        },
      },
      {
        title: "Option 10",
        icon: "mdi-dots-horizontal",
        visible: false,
        dialog: false,
        contentType: "card",
        content: {
          title: "Card Title 10",
          text: "Content for Option 10",
        },
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
          schema: viewer_schemas.opengeodeweb_viewer.get_mouse,
          params: { x, y },
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
