import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  }),
  actions: {
    fetchUserData() {},
    updateProfile() {},
  },
});
