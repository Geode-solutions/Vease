<script setup lang="ts">
import StepActions from "@vease/components/StepActions.vue";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { useDataStore } from "@ogw_front/stores/data";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useProjectCrs } from "@vease/composables/project_crs";

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
  // Filename -> type; files without a type are not supported and are skipped
  geodeObjectTypes: Record<string, string>;
  skippedFiles?: string[];
}>();

const dataStore = useDataStore();
const { harmonizeImportedCrs } = useProjectCrs();

async function import_files(): Promise<void> {
  const files_to_import = filenames.flatMap((filename) => {
    const geode_object_type = geodeObjectTypes[filename];
    return geode_object_type === undefined || skippedFiles.includes(filename)
      ? []
      : [{ filename, geode_object_type }];
  });
  const left_out = filenames.filter(
    (filename) => !files_to_import.some((file) => file.filename === filename),
  );
  if (left_out.length > 0) {
    useFeedbackStore().add_warning(`Skipped files: ${left_out.join(", ")}`);
  }
  // The import workflow throws as soon as one file fails: the new items are found by difference
  const existingItems = await dataStore.allItems();
  const existingIds = new Set(existingItems.map((item) => item.id));
  try {
    await importWorkflow(files_to_import);
  } finally {
    const items = await dataStore.allItems();
    const importedIds = items.map((item) => item.id).filter((id) => !existingIds.has(id));
    await harmonizeImportedCrs(importedIds);
  }
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
