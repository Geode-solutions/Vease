<script setup lang="ts">
import AuthDeleteAccountDialog from "@vease/components/Auth/DeleteAccountDialog.vue";
import { useAuth } from "@vease/composables/auth";

const { logout, user } = useAuth();
const showDeleteAccount = ref(false);
</script>

<template>
  <v-row no-gutters class="fill-height align-center justify-center">
    <v-col cols="12" sm="8" md="6" lg="4" xl="3" class="pa-6">
      <v-sheet color="transparent" class="d-flex flex-column align-center w-100 px-4">
        <v-avatar color="rgba(0, 0, 0, 0.1)" size="120" class="mb-8 account-avatar">
          <v-icon icon="mdi-account" size="80" color="white" />
        </v-avatar>

        <v-row align="center" justify="center" class="flex-column text-center mb-6 w-100 pa-0">
          <v-col cols="12" class="pa-0">
            <p class="text-subtitle-1 text-white text-center opacity-60 mb-1 font-weight-medium">
              Logged as
            </p>
          </v-col>
          <v-col cols="12" class="pa-0">
            <p
              class="text-h5 text-white text-center font-weight-bold"
              style="word-break: break-all"
            >
              {{ user?.email }}
            </p>
          </v-col>
        </v-row>
        <v-row class="pa-0">
          <v-col cols="12" class="pa-0">
            <v-btn
              color="primary"
              size="large"
              block
              class="action-btn text-none font-weight-black rounded-lg mb-6"
              prepend-icon="mdi-logout"
              @click="logout()"
            >
              Logout
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="pa-0">
          <v-btn
            text="Back to Viewer"
            variant="text"
            color="white"
            class="text-none opacity-70"
            @click="navigateTo('/')"
            prepend-icon="mdi-arrow-left"
          />
        </v-row>

        <v-row class="pa-5">
          <v-btn
            text="Delete my account"
            variant="text"
            color="white"
            class="text-none opacity-70"
            @click="showDeleteAccount = true"
            prepend-icon="mdi-delete"
          />
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>

  <AuthDeleteAccountDialog v-model="showDeleteAccount" />
</template>

<style scoped>
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
