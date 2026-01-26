<template>
  <v-card-actions class="mt-4">
    <v-btn ref="import_button" :loading="loading" color="primary" variant="elevated" size="large" rounded="lg"
      class="text-none px-8 font-weight-bold" @click="import_files">
      <v-icon start size="20">mdi-file-upload-outline</v-icon>
      Import
    </v-btn>

    <v-btn color="error" variant="text" size="large" class="text-none ml-2 font-weight-bold" @click="cancel">
      Cancel
    </v-btn>
  </v-card-actions>
</template>

<script setup>
import { importWorkflow } from "@ogw_front/utils/file_import_workflow"
import { useUIStore } from "@vease/stores/UI"

const emit = defineEmits([
  "update_values",
  "increment_step",
  "decrement_step",
  "reset_values",
])

const props = defineProps({
  filenames: { type: Array, required: true },
  geode_object_type: { type: String, required: true },
})

const UIStore = useUIStore()

const import_button = useTemplateRef("import_button")
useFocus(import_button, { initialValue: true })

const loading = ref(false)
const toggle_loading = useToggle(loading)

async function import_files() {
  toggle_loading()
  const files_array = props.filenames.map((filename) => ({
    filename,
    geode_object_type: props.geode_object_type,
  }))
  await importWorkflow(files_array)
  emit("reset_values")
  UIStore.setShowStepper(false)
  toggle_loading()
}

function cancel() {
  emit("reset_values")
  UIStore.setShowStepper(false)
}
</script>