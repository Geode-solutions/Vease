<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
</script>

<template>
  <v-tooltip :text="active ? 'Exit pick mode (Esc)' : 'Pick points from viewer'" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="secondary"
        :variant="active ? 'flat' : 'outlined'"
        size="small"
        block
        class="rounded-lg text-none font-weight-bold"
        :class="{ 'pick-pulse': active }"
        prepend-icon="mdi-crosshairs-gps"
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
    box-shadow: 0 0 0 0 rgba(var(--v-theme-secondary), 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-secondary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-secondary), 0);
  }
}
.pick-pulse {
  animation: pulse-ring 1.5s ease-out infinite;
}
</style>
