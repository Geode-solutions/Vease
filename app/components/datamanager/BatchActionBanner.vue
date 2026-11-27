<script setup lang="ts">
import type { DataItem } from "@ogw_front/stores/data";

interface Props {
  selectedIds: DataItem[];
}

interface Emits {
  delete: [];
  "toggle-visibility-selected": [];
  clear: [];
}

const { selectedIds } = defineProps<Props>();

const emit = defineEmits<Emits>();
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
            prepend-icon="ph-eye"
            size="small"
            variant="tonal"
            color="primary"
            class="text-none"
            data-testid="batchVisibilityButton"
            @click="emit('toggle-visibility-selected')"
          >
            Toggle Visibility
          </v-btn>

          <v-btn
            prepend-icon="ph-trash"
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

        <v-btn icon="ph-x" size="x-small" variant="text" @click="emit('clear')">
          <v-tooltip activator="parent" location="top">Clear selection</v-tooltip>
        </v-btn>
      </div>
    </v-sheet>
  </v-expand-transition>
</template>

<style scoped>
.banner-container {
  background: rgba(var(--v-theme-primary), 0.06) !important;
}
</style>
