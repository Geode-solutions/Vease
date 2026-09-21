<script setup lang="ts">
import type { Ref } from "vue";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { useUIStore } from "@vease/stores/ui";

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

const UIStore = useUIStore();

const import_button = useTemplateRef("import_button");
// VueUse's useFocus supports component refs at runtime (it reads `.$el`), but
// Vuetify's generated component instance type is too complex for its own
// MaybeElementRef declaration to structurally match.
useFocus(import_button as unknown as Ref<HTMLElement | null>, { initialValue: true });

const loading = ref(false);
const toggle_loading = useToggle(loading);

async function import_files() {
  toggle_loading();
  const files_array = filenames.map((filename) => ({
    filename,
    geode_object_type: geodeObjectType,
  }));
  try {
    await importWorkflow(files_array);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    emit("reset_values");
    UIStore.setShowStepper(false);
    toggle_loading();
  }
}

function cancel() {
  emit("reset_values");
  UIStore.setShowStepper(false);
}
</script>

<template>
  <v-card-actions class="mt-4">
    <v-btn
      ref="import_button"
      data-testid="finalizeImportButton"
      :loading="loading"
      color="primary"
      variant="elevated"
      size="large"
      rounded="lg"
      class="text-none px-8 font-weight-bold"
      @click="import_files"
    >
      <v-icon start size="20">mdi-file-upload-outline</v-icon>
      Import
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
