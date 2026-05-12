<script setup>
import AuthBackground from "@vease/components/Auth/AuthBackground";
import AuthForgotPasswordDialog from "@vease/components/Auth/AuthForgotPasswordDialog";
import AuthForm from "@vease/components/Auth/AuthForm";
import logo from "@vease/assets/img/logo.png";
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
  onSubmit,
  handleForgotPassword,
  toggleMode,
} = useAuthPage();
</script>

<template>
  <v-container fluid class="pa-0 fill-height position-relative overflow-hidden auth-page">
    <AuthBackground />

    <v-row no-gutters class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3" class="pa-6">
        <v-sheet color="transparent" width="100%" class="text-center mb-4">
          <v-responsive class="mx-auto mb-2" max-width="120">
            <v-img :src="logo" contain />
          </v-responsive>
          <v-card-title
            class="text-h3 font-weight-black title-text mb-2 px-0 d-flex justify-center"
          >
            Vease
          </v-card-title>
          <v-card-subtitle class="text-body-1 text-white opacity-70 px-0 text-center">
            {{
              isLogin
                ? "Welcome back! Please login to your account"
                : "Create an account to get started"
            }}
          </v-card-subtitle>
        </v-sheet>

        <AuthForm
          v-model:email="email"
          v-model:password="password"
          v-model:confirm-password="confirmPassword"
          v-model:error="error"
          v-model:success-message="successMessage"
          :is-login="isLogin"
          :loading="loading"
          @submit="onSubmit"
          @toggle-mode="toggleMode"
          @forgot-password="showForgotPassword = true"
        />
      </v-col>
    </v-row>

    <AuthForgotPasswordDialog
      v-model="showForgotPassword"
      v-model:email="forgotPasswordEmail"
      :loading="forgotPasswordLoading"
      @submit="handleForgotPassword"
    />
  </v-container>
</template>

<style scoped>
.auth-page {
  background: rgba(0, 0, 0, 0.1);
}

.title-text {
  font-family: "Michroma", sans-serif !important;
  background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px !important;
  text-transform: uppercase;
}

.fill-height {
  height: 100vh !important;
}
</style>
