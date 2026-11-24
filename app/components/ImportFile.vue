<script setup lang="ts">
import StepActions from "@vease/components/StepActions.vue";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

const emit = defineEmits<{
  update_values: [];
  increment_step: [];
  decrement_step: [];
  reset_values: [];
}>();

const {
  filenames,
  geodeObjectTypes,
  skippedFiles = [],
} = defineProps<{
  filenames: string[];
  // Filename -> types (a file can hold several contents); files without a type are skipped
  geodeObjectTypes: Record<string, string[]>;
  skippedFiles?: string[];
}>();

async function import_files(): Promise<void> {
  const files_to_import = filenames.flatMap((filename) => {
    const types = geodeObjectTypes[filename];
    if (types === undefined || skippedFiles.includes(filename)) {
      return [];
    }
    return types.map((geode_object_type) => ({ filename, geode_object_type }));
  });
  const left_out = filenames.filter(
    (filename) => !files_to_import.some((file) => file.filename === filename),
  );
  if (left_out.length > 0) {
    useFeedbackStore().add_warning(`Skipped files: ${left_out.join(", ")}`);
  }
  // The import workflow harmonizes the imported data with the project CRS
  await importWorkflow(files_to_import);
}
</script>

<template>
  <StepActions
    label="Import"
    icon="ph-file-arrow-up"
    test-id="finalizeImportButton"
    :action="import_files"
    @reset_values="emit('reset_values')"
  />
</template>
