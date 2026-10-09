<script setup lang="ts">
import StepActions from "@vease/components/StepActions.vue";
import { importWorkflow } from "@ogw_front/utils/import_workflow";

const emit = defineEmits<{
  update_values: [];
  increment_step: [];
  decrement_step: [];
  reset_values: [];
}>();

const { filenames, geodeObjectType } = defineProps<{
  filenames: string[];
  geodeObjectType: string;
}>();

async function import_files(): Promise<void> {
  await importWorkflow(
    filenames.map((filename) => ({ filename, geode_object_type: geodeObjectType })),
  );
}
</script>

<template>
  <StepActions
    label="Import"
    icon="mdi-file-upload-outline"
    test-id="finalizeImportButton"
    :action="import_files"
    @reset_values="emit('reset_values')"
  />
</template>
