<template>
  <v-expand-transition>
    <div
      v-if="selectedCount > 0"
      class="mb-4 pa-2 batch-banner rounded-lg d-flex align-center justify-space-between"
    >
      <div class="d-flex align-center ga-2">
        <span class="text-subtitle-2 text-white px-2"
          >{{ selectedCount }} items selected</span
        >
        <v-divider vertical class="mx-2" />
        <v-btn
          prepend-icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="$emit('delete')"
          >Delete</v-btn
        >
      </div>
      <v-btn
        icon="mdi-close"
        size="x-small"
        variant="text"
        color="white"
        @click="$emit('clear')"
      />
    </div>
  </v-expand-transition>
</template>

<script setup>
  defineProps({
    selectedCount: {
      type: Number,
      default: 0,
    },
  })

  defineEmits(["delete", "clear"])
</script>

<style scoped>
  .batch-banner {
    background: rgba(var(--v-theme-primary), 0.15);
    border: 1px solid rgba(var(--v-theme-primary), 0.3);
  }
</style>
