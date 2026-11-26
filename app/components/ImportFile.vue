<script setup lang="ts">
import StepActions from "@vease/components/StepActions.vue";
import { consola } from "consola";
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

// The import is not awaited: a failed file is reported by the snackbar of its request, and the rejection of the
// Workflow is caught here so that it is not left unhandled
async function importInBackground(
  files_to_import: Parameters<typeof importWorkflow>[0],
): Promise<void> {
  try {
    await importWorkflow(files_to_import);
  } catch (error) {
    consola.error("Import failed:", error);
  }
}

function import_files(): void {
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
  // Each file shows in the object tree with a spinner while it is imported, then the import workflow harmonizes
  // The imported data with the project CRS: the stepper closes right away and the UI stays usable, the snackbars
  // Report the outcome
  void importInBackground(files_to_import);
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
