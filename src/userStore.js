import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userImage: null,
  }),
  actions: {
    setUserImage(image) {
      this.userImage = image;
    },
  },
});
