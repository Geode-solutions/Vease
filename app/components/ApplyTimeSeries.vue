<script setup lang="ts">
import type { Ref } from "vue";
import { applyTimeSeriesWorkflow } from "@ogw_front/utils/import_workflow";
import { consola } from "consola";
import { useUIStore } from "@vease/stores/ui";

const emit = defineEmits<{
  update_values: [];
  increment_step: [];
  decrement_step: [];
  reset_values: [];
}>();

const { filename, targetId } = defineProps<{
  filename: string;
  targetId: string;
}>();

const UIStore = useUIStore();

const apply_button = useTemplateRef("apply_button");
useFocus(apply_button as unknown as Ref<HTMLElement | null>, {
  initialValue: true,
});

const loading = ref(false);
const toggle_loading = useToggle(loading);

async function apply_time_series(): Promise<void> {
  toggle_loading();
  try {
    await applyTimeSeriesWorkflow(filename, targetId);
  } catch (error) {
    consola.error("Time series import failed:", error);
  } finally {
    emit("reset_values");
    UIStore.setShowStepper(false);
    toggle_loading();
  }
}

function cancel(): void {
  emit("reset_values");
  UIStore.setShowStepper(false);
}
</script>

<template>
  <v-card-actions class="mt-4">
    <v-btn
      ref="apply_button"
      data-testid="applyTimeSeriesButton"
      :loading="loading"
      color="primary"
      variant="elevated"
      size="large"
      rounded="lg"
      class="text-none px-8 font-weight-bold"
      @click="apply_time_series"
    >
      <v-icon start size="20">mdi-timeline-clock-outline</v-icon>
      Apply
    </v-btn>
    <v-btn
      color="error"
      variant="text"
      size="large"
      class="text-none ml-2 font-weight-bold"
      @click="cancel"
    >
      Cancel
    </v-btn>
  </v-card-actions>
</template>
