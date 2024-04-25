<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card color="#277a67" class="custom-card">
          <v-card-title class="text-center">
            <h2 class="mb-6">Profil Management</h2>
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
                class="mt-4 flex flex-col space-y-4"
                @submit.prevent="uploadImage"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex items-center justify-center h-40 w-40">
                    <label
                      for="dropzone-file"
                      class="flex flex-col items-center justify-center border-2 h-40 w-40 border-gray-300 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100"
                      ><v-file-input
                        prepend-icon="mdi-camera"
                        label="Profil Picture"
                        ref="files"
                        accept="image/*"
                        id="dropzone-file"
                        type="file"
                        class="hidden"
                        @change="onFileChange"
                      />
                      <div
                        v-if="!image"
                        class="flex flex-col items-center justify-center pt-5 pb-6"
                      ></div>
                      <img
                        v-else
                        :src="image"
                        class="rounded-full object-fill"
                        :width="250"
                        aspect-ratio="16/19"
                        cover
                      />
                    </label>
                  </div>
                  <v-btn type="submit" class="mb-6"> Upload Image </v-btn>
                </div>
                <span
                  v-if="success || error"
                  :class="{
                    'text-green-600': success,
                    'text-red-600': error,
                  }"
                  class="font-medium mb-6"
                  >{{ success || error }}</span
                >
              </form>
              <v-btn
                :disabled="!valid || !imageUploaded"
                color="#277a67"
                block
                class="icon-style custom-button"
                type="submit"
              >
                Update profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.custom-card {
  border: 1px solid white;
  border-radius: 20px;
  padding: 20px;
}

.custom-button {
  border: 1px solid white;
  padding: 25px;
}
</style>

<script setup>
const valid = ref(true);
const showPassword = ref(false);
const userStore = useUserStore();

const { firstName, lastName, email, password, profileImage } = userStore;

const files = ref();
const image = ref();
const success = ref();
const error = ref();
const imageUploaded = ref(false);

const nameRules = [
  (v) => !!v || "Name is required",
  (v) => /^[\p{L}\p{M}\s]*$/u.test(v) || "Use only letters and spaces",
  (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
];

const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      v
    ) || "E-mail should be valid",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 12) || "Password must be at least 12 characters",
];

const confirmPasswordRules = [
  (v) => !!v || "Confirm password is required",
  (v) => v === password || "Passwords are different",
];

const updateProfile = () => {
  if (valid.value) {
    console.log("Update profile", image);
    userStore.$patch({
      firstName,
      lastName,
      email,
      password,
      image,
    });
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

function onFileChange(e) {
  const file = e.target.files[0];
  image.value = URL.createObjectURL(file);
}

async function uploadImage() {
  try {
    error.value = null;
    success.value = null;
    const formData = new FormData();
    Array.from(files.value.files).map((file, index) =>
      formData.append(index, file)
    );

    const { message } = await $fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    success.value = message;
    imageUploaded.value = true;
  } catch (e) {
    error.value = e.statusMessage;
  }
}
</script>
