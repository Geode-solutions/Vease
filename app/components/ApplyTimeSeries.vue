<script setup lang="ts">
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { FileName } from "@ogw_front/types/files";
import StepActions from "@vease/components/StepActions.vue";
import { applyTimeSeriesWorkflow } from "@ogw_front/utils/import_workflow";

interface Props {
  filename: FileName;
  targetId: DataId;
}

interface Emits {
  update_values: [];
  increment_step: [];
  decrement_step: [];
  reset_values: [];
}

const emit = defineEmits<Emits>();

const { filename, targetId } = defineProps<Props>();

async function apply_time_series(): Promise<void> {
  await applyTimeSeriesWorkflow(filename, targetId);
}
</script>

<template>
  <StepActions
    label="Apply"
    icon="ph-clock"
    test-id="applyTimeSeriesButton"
    :action="apply_time_series"
    @reset_values="emit('reset_values')"
  />
</template>
