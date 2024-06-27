<template>
  <Stepper />
</template>

<script setup>
import _ from "lodash";
import FileSelector from "@geode/opengeodeweb-front/components/FileSelector.vue";
import MissingFilesSelector from "@geode/opengeodeweb-front/components/MissingFilesSelector.vue";
import ObjectSelector from "@geode/opengeodeweb-front/components/ObjectSelector.vue";
import ImportFile from "@/components/ImportFile.vue";

const geode_store = use_geode_store();
const viewer_store = use_viewer_store();

geode_store.$patch({ is_running: true });
viewer_store.$patch({ is_running: true });

const files = ref([]);
const input_geode_object = ref("");
const additional_files = ref([]);
const supported_feature = "crs";

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
          return [files, input_geode_object, input_geode_object];
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
