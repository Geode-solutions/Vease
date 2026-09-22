async function fetchUserData(): Promise<void> {
  // Function placeholder
}

async function updateProfile(): Promise<void> {
  // Function placeholder
}

export const useUserStore = defineStore("user", () => {
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const image = ref("");

  return {
    firstName,
    lastName,
    email,
    password,
    image,
    fetchUserData,
    updateProfile,
  };
});
