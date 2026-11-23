<script setup lang="ts">
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { emailRules } from "~/utils/validation";

const show = defineModel({ type: Boolean, default: false });

const email = defineModel("email", { type: String });

const { loading = false, error = "" } = defineProps<{
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{ submit: [] }>();

async function handleSubmit(event): Promise<void> {
  const { valid } = await event;
  if (valid) {
    emit("submit");
  }
}
</script>

<template>
  <v-dialog v-model="show" max-width="450">
    <GlassCard variant="panel" padding="pa-8" rounded="xl" border="border-primary">
      <v-form @submit.prevent="handleSubmit">
        <v-card-title class="text-h4 font-weight-bold mb-4 px-0"> Reset Password </v-card-title>
        <v-card-text class="text-body-1 text-medium-emphasis mb-6 px-0">
          Enter your email address and we'll send you a recovery link.
        </v-card-text>

        <v-alert v-if="error" type="error" variant="elevated" closable class="mb-6 rounded-lg">
          {{ error }}
        </v-alert>

        <v-text-field
          v-model="email"
          label="Email Address"
          type="email"
          :rules="emailRules"
          variant="outlined"
          color="primary"
          class="custom-field mb-8"
          hide-details="auto"
        />

        <v-card-actions class="px-0 ga-4">
          <v-btn
            variant="text"
            color="primary"
            rounded="pill"
            class="flex-grow-1 text-none"
            @click="show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="accent"
            variant="flat"
            rounded="pill"
            class="flex-grow-1 text-none font-weight-black"
            :loading="loading"
          >
            Send recovery link
          </v-btn>
        </v-card-actions>
      </v-form>
    </GlassCard>
  </v-dialog>
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
</style>
