<script setup>
import GlassCard from "@ogw_front/components/GlassCard";
import { useAuth } from "@vease/composables/auth";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

const feedbackStore = useFeedbackStore();
const { deleteAccount } = useAuth();
const showDeleteAccount = defineModel({ type: Boolean, default: false });
const loading = ref(false);

const emit = defineEmits(["submit"]);

async function handleDeleteAccount() {
  loading.value = true;
  try {
    await deleteAccount();
    feedbackStore.add_success("Account successfully deleted");
  } catch (error) {
    const code = 500;
    feedbackStore.add_error(code, "/delete-account", "Delete account", error);
  }
  loading.value = false;
  await navigateTo("/login");
}
</script>

<template>
  <v-dialog v-model="showDeleteAccount" max-width="450">
    <GlassCard variant="panel" padding="pa-8" rounded="xl" border="border-primary">
      <v-card-title class="text-h4 font-weight-bold mb-4 text-white px-0">
        Delete Account
      </v-card-title>
      <v-card-text class="text-body-1 text-white opacity-80 mb-8 px-0">
        Are you sure you want to delete your account? This action is irreversible and will
        permanently remove all your data from our servers.
      </v-card-text>

      <v-card-actions class="px-0 ga-4">
        <v-btn
          variant="text"
          color="white"
          class="flex-grow-1 text-none"
          @click="showDeleteAccount = false"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          variant="flat"
          class="flex-grow-1 text-none font-weight-black"
          @click="handleDeleteAccount"
        >
          Delete Account
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
