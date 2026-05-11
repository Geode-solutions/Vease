<script setup>
import { useAuth } from "@vease/composables/auth";
import AuthBackground from "@vease/components/Auth/AuthBackground";

const { user, logout } = useAuth();

function handleLogout() {
  logout();
  navigateTo("/login");
}
</script>

<template>
  <v-container fluid class="pa-0 fill-height position-relative overflow-hidden account-page">
    <AuthBackground />

    <v-row no-gutters class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3" class="pa-6">
        <div class="d-flex flex-column align-center w-100 px-4">
          <v-avatar color="rgba(255, 255, 255, 0.1)" size="120" class="mb-8 account-avatar">
            <v-icon icon="mdi-account" size="80" color="white" />
          </v-avatar>

          <div class="text-center mb-12">
            <div class="text-h6 text-white opacity-60 mb-1 font-weight-medium">Logged as</div>
            <div class="text-h4 text-white font-weight-black">
              {{ user?.email }}
            </div>
          </div>

          <v-btn
            color="primary"
            size="x-large"
            block
            class="action-btn text-none font-weight-black rounded-lg mb-6"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Logout
          </v-btn>

          <v-btn
            variant="text"
            color="white"
            class="text-none opacity-70"
            @click="navigateTo('/')"
            prepend-icon="mdi-arrow-left"
          >
            Back to Viewer
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.account-page {
  background: rgba(0, 0, 0, 0.1);
}

.account-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.action-btn {
  height: 64px !important;
  font-size: 1.2rem !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.action-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

.v-btn--variant-text:hover {
  opacity: 1 !important;
}
</style>
