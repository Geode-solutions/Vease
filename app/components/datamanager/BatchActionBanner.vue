<script setup>
const { selectedIds } = defineProps({
  selectedIds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["delete", "toggle-visibility-selected", "clear"]);
</script>

<template>
  <v-expand-transition>
    <v-sheet
      v-if="selectedIds.length > 0"
      class="mb-4 pa-3 border-thin rounded-lg banner-container"
      color="transparent"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div class="d-flex align-center ga-2 flex-wrap">
          <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
            {{ selectedIds.length }} {{ selectedIds.length === 1 ? "item" : "items" }} selected
          </v-chip>

          <v-btn
            prepend-icon="mdi-eye-outline"
            size="small"
            variant="tonal"
            color="white"
            class="text-none"
            data-testid="batchVisibilityButton"
            @click="emit('toggle-visibility-selected')"
          >
            Toggle Visibility
          </v-btn>

          <v-btn
            prepend-icon="mdi-delete"
            size="small"
            variant="flat"
            color="error"
            class="text-none font-weight-bold"
            data-testid="batchDeleteButton"
            @click="emit('delete')"
          >
            Delete Selected
          </v-btn>
        </div>

        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="text"
          color="white"
          @click="emit('clear')"
        >
          <v-tooltip activator="parent" location="top">Clear selection</v-tooltip>
        </v-btn>
      </div>
    </v-sheet>
  </v-expand-transition>
</template>

<style scoped>
.banner-container {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(8px);
}
</style>
