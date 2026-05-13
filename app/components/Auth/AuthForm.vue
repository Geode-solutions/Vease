<script setup>
const { isLogin, loading } = defineProps({
  isLogin: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
});

const error = defineModel("error", { type: String, default: "" });
const successMessage = defineModel("successMessage", { type: String, default: "" });
const email = defineModel("email");
const password = defineModel("password");
const confirmPassword = defineModel("confirmPassword");

const emit = defineEmits(["submit", "toggle-mode", "forgot-password"]);

const passwordVisible = ref(false);
</script>

<template>
  <v-form @submit.prevent="emit('submit')">
    <v-text-field
      v-model="email"
      label="Email Address"
      type="email"
      variant="outlined"
      prepend-inner-icon="mdi-email-outline"
      required
      class="custom-field mb-6"
      color="white"
      autocomplete="email"
      hide-details="auto"
    />

    <v-text-field
      v-model="password"
      label="Password"
      :type="passwordVisible ? 'text' : 'password'"
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="passwordVisible = !passwordVisible"
      required
      class="custom-field mb-6"
      color="white"
      autocomplete="current-password"
      hide-details="auto"
    />

    <v-expand-transition>
      <div v-if="!isLogin">
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="passwordVisible ? 'text' : 'password'"
          variant="outlined"
          prepend-inner-icon="mdi-lock-check-outline"
          required
          class="custom-field mb-6"
          color="white"
          autocomplete="new-password"
          hide-details="auto"
        />
      </div>
    </v-expand-transition>

    <div v-if="isLogin" class="d-flex justify-end mb-8 mt-n4">
      <v-btn
        variant="text"
        color="white"
        size="small"
        class="text-none font-weight-medium opacity-90"
        @click="emit('forgot-password')"
      >
        Forgot your password?
      </v-btn>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="elevated"
      closable
      class="mb-6 rounded-lg"
      @click:close="error = ''"
    >
      {{ error }}
    </v-alert>

    <v-alert
      v-if="successMessage"
      type="success"
      variant="elevated"
      closable
      class="mb-6 rounded-lg"
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>

    <v-btn
      type="submit"
      color="primary"
      size="x-large"
      block
      :loading="loading"
      class="submit-btn text-none font-weight-black rounded-lg mb-4"
    >
      {{ isLogin ? "Sign In" : "Get Started" }}
    </v-btn>

    <v-sheet color="transparent" class="text-center">
      <v-card-subtitle class="text-body-1 text-white opacity-90 px-0 text-center">
        {{ isLogin ? "New to Vease?" : "Already have an account?" }}
        <v-btn
          variant="text"
          color="white"
          class="text-none px-2 font-weight-black text-decoration-underline"
          @click="emit('toggle-mode')"
        >
          {{ isLogin ? "Create an account" : "Log in" }}
        </v-btn>
      </v-card-subtitle>
    </v-sheet>
  </v-form>
</template>

<style scoped>
.custom-field :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;
}

.custom-field :deep(.v-field:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
}

.custom-field :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: white !important;
}

.custom-field :deep(.v-label) {
  color: white !important;
  opacity: 0.9 !important;
}

.custom-field :deep(.v-icon) {
  color: white !important;
  opacity: 1 !important;
}

.custom-field :deep(input) {
  color: white !important;
}

.submit-btn {
  height: 64px !important;
  font-size: 1.2rem !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.submit-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}
</style>
