<script setup lang="ts">
import AuthForm from "@vease/components/Auth/Form.vue";
import BrandMark from "@vease/components/Layout/BrandMark.vue";
import { useAuthPage } from "@vease/composables/auth_page";

const { email, isLogin, password } = useAuthPage();
</script>

<template>
  <v-row class="align-center justify-center">
    <v-col cols="12" class="auth-column pa-6">
      <v-sheet color="transparent" width="100%" class="text-center mb-4">
        <BrandMark :size="96" class="text-primary mb-2" />
        <v-card-title class="text-h3 title-text brand-wordmark mb-2 px-0 d-flex justify-center">
          Vease
        </v-card-title>
        <v-card-subtitle class="text-body-1 px-0 text-center text-wrap">
          {{
            isLogin
              ? "Welcome back! Please login to your account"
              : "Create an account to get started"
          }}
        </v-card-subtitle>
      </v-sheet>

      <AuthForm />
    </v-col>
  </v-row>
</template>

<style scoped>
/* Fixed width instead of a grid fraction: the fields stay wide enough to show a full email address,
   even with the icon password managers inject at the end of the input. */
.auth-column {
  max-width: 520px;
}

.brand-wordmark {
  line-height: 1;
  letter-spacing: -0.02em;
}

.fill-height {
  height: 100vh !important;
}
</style>
