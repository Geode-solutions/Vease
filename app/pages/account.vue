<script setup>
  const MAX_NAME_LENGTH = 50
  const MIN_PASSWORD_LENGTH = 12

  const valid = ref(true)
  const showPassword = ref(false)
  const userStore = useUserStore()

  const { firstName, lastName, email, password, profileImage } = userStore

  const files = ref()
  const image = ref()
  const success = ref()
  const errorMessage = ref()
  const imageUploaded = ref(false)

  const nameRules = [
    (input) => Boolean(input) || "Name is required",
    (input) =>
      /^[\p{L}\p{M}\s]*$/u.test(input) || "Use only letters and spaces",
    (input) =>
      Boolean(input && input.length <= MAX_NAME_LENGTH) ||
      `Name must be less than ${MAX_NAME_LENGTH} characters`,
  ]

  const emailRules = [
    (input) => Boolean(input) || "E-mail is required",
    (input) =>
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        input,
      ) || "E-mail should be valid",
  ]

  const passwordRules = [
    (input) => Boolean(input) || "Password is required",
    (input) =>
      Boolean(input && input.length >= MIN_PASSWORD_LENGTH) ||
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  ]

  const confirmPasswordRules = [
    (input) => Boolean(input) || "Confirm password is required",
    (input) => input === password.value || "Passwords are different",
  ]

  function updateProfile() {
    if (valid.value) {
      console.log("Update profile", image)
      userStore.$patch({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        image: image.value,
      })
    }
  }

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value
  }

  function onFileChange(event) {
    const [file] = event.target.files
    image.value = URL.createObjectURL(file)
  }

  async function uploadImage() {
    try {
      errorMessage.value = null
      success.value = null
      const formData = new FormData()
      let index = 0
      for (const file of files.value.files) {
        formData.append(String(index), file)
        index += 1
      }

      const { message } = await $fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      success.value = message
      imageUploaded.value = true
    } catch (error) {
      errorMessage.value = error.statusMessage
    }
  }
</script>

<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card color="#277a67" class="rounded-xl border pa-5">
          <v-card-title class="text-center">
            <h2 class="mb-6 text-h4 font-weight-bold text-white font-michroma">
              Profil Management
            </h2>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              enctype="multipart/form-data"
              @submit.prevent="updateProfile"
            >
              <v-text-field
                v-model="firstName"
                :rules="nameRules"
                label="First name"
                required
                :counter="50"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="lastName"
                :rules="nameRules"
                label="Name"
                required
                :counter="50"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                class="mb-2"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                label="Password"
                class="mb-2"
                required
                @click:append="togglePasswordVisibility"
              ></v-text-field>
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                :rules="confirmPasswordRules"
                label="Confirm Password"
                class="mb-2"
                required
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="togglePasswordVisibility"
              ></v-text-field>
              <form
                class="mt-4 d-flex flex-column ga-4"
                @submit.prevent="uploadImage"
              >
                <div class="d-flex align-center ga-4">
                  <div
                    class="d-flex align-center justify-center"
                    style="height: 160px; width: 160px"
                  >
                    <label
                      for="dropzone-file"
                      class="d-flex flex-column align-center justify-center border-sm rounded-circle cursor-pointer bg-grey-lighten-4"
                      style="height: 160px; width: 160px"
                    >
                      <v-file-input
                        prepend-icon="mdi-camera"
                        label="Profil Picture"
                        ref="files"
                        accept="image/*"
                        id="dropzone-file"
                        type="file"
                        class="d-none"
                        @change="onFileChange"
                      />
                      <div
                        v-if="!image"
                        class="d-flex flex-column align-center justify-center pt-5 pb-6"
                      ></div>
                      <img
                        v-else
                        :src="image"
                        class="rounded-circle"
                        style="width: 100%; height: 100%; object-fit: cover"
                      />
                    </label>
                  </div>
                  <v-btn type="submit" class="mb-6"> Upload Image </v-btn>
                </div>
                <span
                  v-if="success || errorMessage"
                  :class="success ? 'text-success' : 'text-error'"
                  class="font-weight-medium mb-6"
                  >{{ success || errorMessage }}</span
                >
              </form>
              <v-btn
                :disabled="!valid || !imageUploaded"
                color="#277a67"
                block
                class="rounded-xl border pa-6"
                type="submit"
                height="auto"
              >
                Update profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row></v-container
  >
</template>
