<script setup lang="ts">
defineProps<{ active?: boolean }>();

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <v-tooltip :text="active ? 'Exit pick mode (Esc)' : 'Pick points from viewer'" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        :variant="active ? 'flat' : 'tonal'"
        size="small"
        block
        class="rounded-pill text-none font-weight-bold"
        :class="{ 'pick-pulse': active }"
        prepend-icon="ph-gps-fix"
        data-testid="pickButton"
        @click="emit('click')"
      >
        {{ active ? "Stop picking" : "Pick in viewer" }}
      </v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-primary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}
.pick-pulse {
  animation: pulse-ring 1.5s ease-out infinite;
}
</style>
