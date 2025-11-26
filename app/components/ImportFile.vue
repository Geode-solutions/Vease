<template>
  <v-btn
    :loading="loading"
    color="primary"
    @click="import_files()"
    ref="import_button"
  >
    Import
    <template #loader>
      <v-progress-circular indeterminate size="20" color="white" width="3" />
    </template>
  </v-btn>
  <v-btn variant="text" @click="UIStore.setShowStepper(false)"> Cancel </v-btn>
</template>

<script setup>
  import { importWorkflow } from "@ogw_front/utils/file_import_workflow.js"

  const emit = defineEmits([
    "update_values",
    "increment_step",
    "decrement_step",
  ])

  const props = defineProps({
    filenames: { type: Array, required: true },
    input_geode_object: { type: String, required: true },
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
      geode_object: props.input_geode_object,
    }))
    await importWorkflow(files_array)
    UIStore.setShowStepper(false)
    toggle_loading()
  }
</script>
