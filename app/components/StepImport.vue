<template>
  <Stepper @close="handleClose" @reset_values="reset_values" />
</template>

<script setup>
  import _ from "lodash"
  import Stepper from "@ogw_front/components/Stepper"
  import FileSelector from "@ogw_front/components/FileSelector"
  import MissingFilesSelector from "@ogw_front/components/MissingFilesSelector"
  import ObjectSelector from "@ogw_front/components/ObjectSelector"
  import ImportFile from "@vease/components/ImportFile"
  import { useUIStore } from "@vease/stores/UI"

  const emit = defineEmits(["close"])
  const UIStore = useUIStore()

  const props = defineProps({
    files: { type: Array, default: () => [] },
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
    current_step_index: 0,
    navigating_back: false,
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
        chips: computed(() => files.value.map((file) => file.name)),
      },
      {
        step_title: "Confirm data type",
        component: {
          component_name: shallowRef(ObjectSelector),
          component_options: {
            filenames: computed(() => files.value.map((file) => file.name)),
          },
        },
        chips: computed(() =>
          geode_object_type.value === "" ? [] : [geode_object_type.value],
        ),
      },
      {
        step_title: "Add additional files",
        component: {
          component_name: shallowRef(MissingFilesSelector),
          component_options: {
            multiple: true,
            geode_object_type,
            filenames: computed(() => files.value.map((file) => file.name)),
          },
        },
        chips: computed(() => additional_files.value.map((f) => f.name)),
      },
      {
        step_title: "Finalize import",
        component: {
          component_name: shallowRef(ImportFile),
          component_options: {
            geode_object_type,
            filenames: computed(() => files.value.map((file) => file.name)),
          },
        },
        chips: computed(() => {
          const output_params = [
            geode_object_type.value,
            additional_files.value,
          ]
          return output_params.filter(
            (val) => val !== "" && (!Array.isArray(val) || val.length > 0),
          )
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

  function handleClose() {
    reset_values()
    emit("close")
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
