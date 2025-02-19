import { defineStore } from "pinia";

export const useIdCardStore = defineStore("idCard", {
  state: () => ({
    selectedId: null,
    isVisible: false,
  }),
  actions: {
    showCard(id) {
      this.selectedId = id;
      this.isVisible = true;
    },
    hideCard() {
      this.isVisible = false;
      this.selectedId = null;
    },
  },
});
