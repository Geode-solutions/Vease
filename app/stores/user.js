export const useUserStore = defineStore('user', () => {
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const password = ref('')
  const image = ref('')

  const fetchUserData = async () => {
    // code pour récupérer les données de l'utilisateur
  }

  const updateProfile = async () => {
    // code pour mettre à jour le profil de l'utilisateur
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