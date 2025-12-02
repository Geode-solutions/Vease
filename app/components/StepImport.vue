<template>
  <Stepper @close="$emit('close')" />
</template>

<script setup>
  import _ from "lodash"

  import Stepper from "@ogw_front/components/Stepper.vue"
  import FileSelector from "@ogw_front/components/FileSelector.vue"
  import MissingFilesSelector from "@ogw_front/components/MissingFilesSelector.vue"
  import ObjectSelector from "@ogw_front/components/ObjectSelector.vue"
  import ImportFile from "@vease/components/ImportFile.vue"

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
  const supported_feature = ""

  const stepper_tree = reactive({
    current_step_index: ref(0),
    files,
    auto_upload,
    geode_object_type,
    supported_feature,
    steps: [
      {
        step_title: "Please select file(s) to import",
        component: {
          component_name: shallowRef(FileSelector),
          component_options: {
            multiple: true,
            supported_feature,
            files,
            auto_upload,
          },
        },
        chips: computed(() => {
          return files.value.map((file) => file.name)
        }),
      },
      {
        step_title: "Confirm the data type",
        component: {
          component_name: shallowRef(ObjectSelector),
          component_options: {
            filenames: computed(() => {
              return files.value.map((file) => file.name)
            }),
            supported_feature,
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
        step_title: "Please select additionnal files",
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
        step_title: "Import your file(s)",
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
</script>
