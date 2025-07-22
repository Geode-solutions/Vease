export const useUserStore = defineStore('user', () => {
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const password = ref('')
  const image = ref('')

  const fetchUserData = async () => {
  }

  const updateProfile = async () => {
  }

  return { 
    firstName,
    lastName, 
    email, 
    password, 
    image, 
    fetchUserData, 
    updateProfile 
  }
})
