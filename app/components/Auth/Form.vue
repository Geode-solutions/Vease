<script setup lang="ts">
import AuthForgotPasswordDialog from "@vease/components/Auth/ForgotPasswordDialog.vue";
import { emailRules } from "@vease/utils/validation";
import { useAuthPage } from "@vease/composables/auth_page";

const {
  isLogin,
  loading,
  error,
  successMessage,
  email,
  password,
  confirmPassword,
  showForgotPassword,
  forgotPasswordEmail,
  forgotPasswordLoading,
  forgotPasswordError,
  onSubmit,
  handleForgotPassword,
  toggleMode,
} = useAuthPage();

const passwordVisible = ref(false);

async function handleSubmit(event): Promise<void> {
  const { valid } = await event;
  if (valid) {
    onSubmit();
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      data-testid="eMailInput"
      v-model="email"
      label="Email Address"
      type="email"
      :rules="emailRules"
      variant="outlined"
      prepend-inner-icon="mdi-email-outline"
      required
      class="custom-field mb-6"
      color="primary"
      autocomplete="email"
      hide-details="auto"
    />
    <v-text-field
      data-testid="passwordInput"
      v-model="password"
      label="Password"
      :type="passwordVisible ? 'text' : 'password'"
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="passwordVisible = !passwordVisible"
      required
      class="custom-field mb-6"
      color="primary"
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
          color="primary"
          autocomplete="new-password"
          hide-details="auto"
        />
      </div>
    </v-expand-transition>

    <div v-if="isLogin" class="d-flex justify-end mb-8 mt-n4">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        class="text-none font-weight-medium opacity-90"
        @click="showForgotPassword = true"
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
      data-testid="signInButton"
      type="submit"
      color="accent"
      variant="flat"
      size="x-large"
      block
      :loading="loading"
      class="submit-btn text-none font-weight-black rounded-pill mb-4"
    >
      {{ isLogin ? "Sign In" : "Get Started" }}
    </v-btn>

    <v-sheet color="transparent" class="text-center">
      <v-card-subtitle class="text-body-1 px-0 text-center">
        {{ isLogin ? "New to Vease?" : "Already have an account?" }}
        <v-btn
          variant="text"
          color="primary"
          class="text-none px-2 font-weight-black text-decoration-underline"
          @click="toggleMode"
        >
          {{ isLogin ? "Create an account" : "Log in" }}
        </v-btn>
      </v-card-subtitle>
    </v-sheet>
  </v-form>

  <AuthForgotPasswordDialog
    v-model="showForgotPassword"
    v-model:email="forgotPasswordEmail"
    :loading="forgotPasswordLoading"
    :error="forgotPasswordError"
    @submit="handleForgotPassword"
  />
</template>

<style scoped>
.custom-field :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(var(--v-theme-on-surface), 0.04) !important;
  transition: all 0.3s ease;
}

.custom-field :deep(.v-field:hover) {
  background: rgba(var(--v-theme-on-surface), 0.06) !important;
}

.custom-field :deep(.v-field--focused) {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.submit-btn {
  height: 64px !important;
  font-size: 1.2rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.submit-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
}
</style>
