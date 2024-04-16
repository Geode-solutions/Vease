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
              style="color: white"
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
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                :rules="confirmPasswordRules"
                label="Confirm Password"
                class="mb-2"
                required
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="togglePasswordVisibility"
              ></v-text-field>

              <v-file-input
                v-model="profileImage"
                :rules="imageRules"
                accept="image/png, image/jpeg, image/bmp"
                label="Profil "
                class="mb-2"
                prepend-icon="mdi-camera"
                required
                @change="onImageSelected"
              ></v-file-input>

              <v-img
                v-if="imagePreview"
                :src="imagePreview"
                contain
                height="200"
              ></v-img>

              <v-btn
                :disabled="!valid"
                color="#277a67"
                block
                class="icon-style custom-button"
                @click="updateProfile"
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
import { ref, computed } from "vue";
import { useUserStore } from "@/src/userStore.js";

const valid = ref(true);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const profileImage = ref(null);
const imagePreview = ref(null);

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
  (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
];

const confirmPasswordRules = [
  (v) => !!v || "Confirm password is required",
  (v) => v === password.value || "Passwords are different",
];

const imageRules = [(v) => !!v || "A picture is required"];

const updateProfile = () => {
  if (valid.value) {
    const formData = new FormData();
    formData.append("firstName", firstName.value);
    formData.append("lastName", lastName.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("confirmPassword", confirmPassword.value);
    formData.append("profileImage", profileImage.value);
  }
};

const userStore = useUserStore();

const onImageSelected = (event) => {
  profileImage.value = event;
  imagePreview.value = URL.createObjectURL(event);
  userStore.setUserImage(event);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
