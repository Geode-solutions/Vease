<script setup lang="ts">
import type { DataItem } from "@ogw_front/stores/data";
import type { DataName } from "@ogw_front/types/data";
import GlassCard from "@ogw_front/components/GlassCard.vue";

interface Props {
  show: boolean;
  item: DataItem | undefined;
  initialName: DataName;
}

interface Emits {
  "update:show": [value: boolean];
  confirm: [name: DataName];
}

const { show, item, initialName } = defineProps<Props>();

const emit = defineEmits<Emits>();

const currentName = ref(initialName);

watch(
  () => initialName,
  (newVal) => {
    currentName.value = newVal;
  },
);

function handleConfirm(): void {
  if (!currentName.value) {
    return;
  }
  emit("confirm", currentName.value);
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="emit('update:show', $event)" max-width="400">
    <GlassCard variant="panel" padding="pa-8" :width="400">
      <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center">
        <v-icon icon="ph-pencil-simple" class="mr-3 text-h4" color="primary"></v-icon>
        Rename Item
      </v-card-title>

      <v-card-subtitle class="ma-0"> Enter a new name for this object. </v-card-subtitle>

      <v-card-text class="pt-8 px-0">
        <v-text-field
          :model-value="currentName"
          @update:model-value="currentName = $event"
          type="text"
          variant="outlined"
          color="primary"
          bg-color="surface-light"
          class="mb-4 rounded-lg"
          data-testid="renameDataInput"
          @keydown.enter="handleConfirm"
          hide-details
          clearable
        >
          <template v-slot:label>
            <span>Object Name</span>
          </template>
          <template v-slot:prepend-inner>
            <v-icon>ph-text-t</v-icon>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions class="px-0 pb-0 mt-4">
        <v-btn
          variant="text"
          color="primary"
          size="large"
          @click="emit('update:show', false)"
          class="text-none rounded-pill"
        >
          <v-icon start>ph-x-circle</v-icon>
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          color="accent"
          size="large"
          variant="flat"
          data-testid="renameDataConfirmButton"
          @click="handleConfirm"
          class="text-none rounded-pill font-weight-bold"
        >
          <v-icon start>ph-check-circle</v-icon>
          Rename
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
