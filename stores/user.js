export const useUserStore = defineStore("userStore", {
  state: () => ({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
  }),
  actions: {
    fetchUserData() {},
    updateProfile() {},
  },
});
