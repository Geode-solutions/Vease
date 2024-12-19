export const useUserStore = defineStore("user", {
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
