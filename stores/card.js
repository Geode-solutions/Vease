export const useIdCardStore = defineStore("idCard", {
  state: () => ({
    selectedId: null,
    isVisible: false,
  }),
  actions: {
    showCard(id) {
      this.selectedId = id;
      this.isVisible = true;
      console.log("Showing card with ID:", id);
    },
    hideCard() {
      this.isVisible = false;
      this.selectedId = null;
      console.log("Hiding card");
    },
  },
});
