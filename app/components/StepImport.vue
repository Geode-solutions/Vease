<template>
      <div class="flex-shrink-0">
      <v-card-title
        class="text-h4 text-primary pa-4 font-weight-bold d-flex align-center"
      >
        <v-icon icon="mdi-file-upload-outline" class="mr-3"></v-icon>
        Import Data
      </v-card-title>
      <v-card-subtitle class="ma-0 text-medium pb-4">
        Choose a file to import.
      </v-card-subtitle>
    </div>
  <Stepper
    @close="
      reset_values();
      $emit('close');
    "
    @reset_values="reset_values()"
  />
</template>

<script setup>
  import _ from "lodash"

  import Stepper from "@ogw_front/components/Stepper"
  import FileSelector from "@ogw_front/components/FileSelector"
  import MissingFilesSelector from "@ogw_front/components/MissingFilesSelector"
  import ObjectSelector from "@ogw_front/components/ObjectSelector"
  import ImportFile from "@vease/components/ImportFile"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()

  const props = defineProps({
    files: { type: Array, default: [] },
  })

  const files = ref(props.files)
  watch(
    () => props.files,
    (newVal) => {
      files.value = newVal
    },
    { deep: true },
  )

  const auto_upload = ref(true)
  const geode_object_type = ref("")
  const additional_files = ref([])

  const stepper_tree = reactive({
    current_step_index: ref(0),
    navigating_back: ref(false),
    files,
    auto_upload,
    geode_object_type,
    steps: [
      {
        step_title: "Select files to import",
        component: {
          component_name: shallowRef(FileSelector),
          component_options: {
            multiple: true,
            files,
            auto_upload,
          },
        },
        chips: computed(() => {
          return files.value.map((file) => file.name)
        }),
      },
      {
        step_title: "Confirm data type",
        component: {
          component_name: shallowRef(ObjectSelector),
          component_options: {
            filenames: computed(() => {
              return files.value.map((file) => file.name)
            }),
          },
        },
        chips: computed(() => {
          if (geode_object_type.value === "") {
            return []
          } else {
            return [geode_object_type.value]
          }
        }),
      },

      {
        step_title: "Add additional files",
        component: {
          component_name: shallowRef(MissingFilesSelector),
          component_options: {
            multiple: true,
            geode_object_type,
            filenames: computed(() => {
              return files.value.map((file) => file.name)
            }),
          },
        },
        chips: computed(() => {
          return additional_files.value.map(
            (additional_file) => additional_file.name,
          )
        }),
      },
      {
        step_title: "Finalize import",
        component: {
          component_name: shallowRef(ImportFile),
          component_options: {
            geode_object_type,
            filenames: computed(() => {
              return files.value.map((file) => file.name)
            }),
          },
        },
        chips: computed(() => {
          const output_params = computed(() => {
            return [geode_object_type, additional_files]
          })
          if (_.isEmpty(output_params)) {
            return []
          } else {
            const array = []
            for (const property in output_params.value) {
              if (!([], "").includes(output_params.value[property].value)) {
                array.push(output_params.value[property].value)
              }
            }
            return array
          }
        }),
      },
    ],
  })

  provide("stepper_tree", stepper_tree)

  function reset_values() {
    files.value = []
    UIStore.setDroppedFiles([])
    auto_upload.value = true
    geode_object_type.value = ""
    additional_files.value = []
    stepper_tree.current_step_index = 0
    stepper_tree.navigating_back = false
  }

  watch(
    () => UIStore.showStepper,
    (newVal) => {
      if (!newVal) {
        reset_values()
      }
    },
  )
</script>
