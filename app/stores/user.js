async function fetchUserData() {
  // Function placeholder
}

async function updateProfile() {
  // Function placeholder
}

export const useUserStore = defineStore("user", () => {
  const firstName = ref("")
  const lastName = ref("")
  const email = ref("")
  const password = ref("")
  const image = ref("")

  return {
    firstName,
    lastName,
    email,
    password,
    image,
    fetchUserData,
    updateProfile,
  }
})
