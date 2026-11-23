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
        <v-avatar color="rgba(var(--v-theme-primary), 0.12)" size="120" class="mb-8 account-avatar">
          <v-icon icon="ph-user" size="80" color="primary" />
        </v-avatar>

        <v-row align="center" justify="center" class="flex-column text-center mb-6 w-100 pa-0">
          <v-col cols="12" class="pa-0">
            <p class="text-subtitle-1 text-medium-emphasis text-center mb-1 font-weight-medium">
              Logged as
            </p>
          </v-col>
          <v-col cols="12" class="pa-0">
            <p class="text-h5 text-center font-weight-bold" style="word-break: break-all">
              {{ user?.email }}
            </p>
          </v-col>
        </v-row>
        <v-row class="pa-0">
          <v-col cols="12" class="pa-0">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              block
              class="action-btn text-none font-weight-black rounded-pill mb-6"
              prepend-icon="ph-sign-out"
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
            class="text-none opacity-70"
            @click="navigateTo('/')"
            prepend-icon="ph-arrow-left"
          />
        </v-row>

        <v-row class="pa-5">
          <v-btn
            text="Delete my account"
            variant="text"
            class="text-none opacity-70"
            @click="showDeleteAccount = true"
            prepend-icon="ph-trash"
          />
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>

  <AuthDeleteAccountDialog v-model="showDeleteAccount" />
</template>

<style scoped>
.account-avatar {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.action-btn {
  height: 64px !important;
  font-size: 1.2rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.action-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
}

.v-btn--variant-text:hover {
  opacity: 1 !important;
}
</style>
