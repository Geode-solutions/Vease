<template>
  <Stepper @close="$emit('close')" />
</template>

<script setup>
import _ from "lodash";
import FileSelector from "@geode/opengeodeweb-front/components/FileSelector.vue";
import MissingFilesSelector from "@geode/opengeodeweb-front/components/MissingFilesSelector.vue";
import ObjectSelector from "@geode/opengeodeweb-front/components/ObjectSelector.vue";
import ImportFile from "@/components/ImportFile.vue";

const files = ref([]);
const input_geode_object = ref("");
const additional_files = ref([]);
const supported_feature = "";
const props = defineProps({
  files: {
    type: Array,
    default: [],
  },
});
files.value = props.files;

const stepper_tree = reactive({
  current_step_index: ref(0),
  files,
  input_geode_object,
  supported_feature,
  steps: [
    {
      step_title: "Please select a file to convert",
      component: {
        component_name: shallowRef(FileSelector),
        component_options: {
          multiple: true,
          supported_feature,
          files,
        },
      },
      chips: computed(() => {
        return files.value.map((file) => file.name);
      }),
    },
    {
      step_title: "Confirm the data type",
      component: {
        component_name: shallowRef(ObjectSelector),
        component_options: {
          filenames: computed(() => {
            return files.value.map((file) => file.name);
          }),
          supported_feature,
        },
      },
      chips: computed(() => {
        if (input_geode_object.value === "") {
          return [];
        } else {
          return [input_geode_object.value];
        }
      }),
    },

    {
      step_title: "Please select additionnal files",
      component: {
        component_name: shallowRef(MissingFilesSelector),
        component_options: {
          multiple: true,
          input_geode_object,
          filenames: computed(() => {
            return files.value.map((file) => file.name);
          }),
        },
      },
      chips: computed(() => {
        return additional_files.value.map(
          (additional_file) => additional_file.name
        );
      }),
    },
    {
      step_title: "Import your file(s)",
      component: {
        component_name: shallowRef(ImportFile),
        component_options: {
          input_geode_object,
          filenames: computed(() => {
            return files.value.map((file) => file.name);
          }),
        },
      },
      chips: computed(() => {
        const output_params = computed(() => {
          return [input_geode_object, additional_files];
        });
        if (_.isEmpty(output_params)) {
          return [];
        } else {
          const array = [];
          for (const property in output_params.value) {
            if (output_params.value[property].value !== "") {
              array.push(output_params.value[property].value);
            }
          }
          return array;
        }
      }),
    },
  ],
});

provide("stepper_tree", stepper_tree);
</script>
