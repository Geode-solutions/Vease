<script setup>
import GlassCard from "@ogw_front/components/GlassCard";

const show = defineModel({ type: Boolean, default: false });

const email = defineModel("email");

const { loading } = defineProps({
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["submit"]);
</script>

<template>
  <v-dialog v-model="show" max-width="450">
    <GlassCard variant="panel" padding="pa-8" rounded="xl" border="border-primary">
      <v-card-title class="text-h4 font-weight-bold mb-4 text-white px-0">
        Reset Password
      </v-card-title>
      <v-card-text class="text-body-1 text-white opacity-80 mb-8 px-0">
        Enter your email address and we'll send you a recovery link.
      </v-card-text>

      <v-text-field
        v-model="email"
        label="Email Address"
        type="email"
        variant="outlined"
        color="white"
        class="custom-field mb-8"
        hide-details
      />

      <v-card-actions class="px-0 ga-4">
        <v-btn variant="text" color="white" class="flex-grow-1 text-none" @click="show = false">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="flex-grow-1 text-none font-weight-black"
          :loading="loading"
          @click="emit('submit')"
        >
          Send recovery link
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
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
</style>
