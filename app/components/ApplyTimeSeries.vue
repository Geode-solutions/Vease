<script setup lang="ts">
import StepActions from "@vease/components/StepActions.vue";
import { applyTimeSeriesWorkflow } from "@ogw_front/utils/import_workflow";

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

async function apply_time_series(): Promise<void> {
  await applyTimeSeriesWorkflow(filename, targetId);
}
</script>

<template>
  <StepActions
    label="Apply"
    icon="mdi-timeline-clock-outline"
    test-id="applyTimeSeriesButton"
    :action="apply_time_series"
    @reset_values="emit('reset_values')"
  />
</template>
