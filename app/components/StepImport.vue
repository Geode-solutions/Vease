<script setup>
import FileSelector from "@ogw_front/components/FileSelector";
import ImportFile from "@vease/components/ImportFile";
import MissingFilesSelector from "@ogw_front/components/MissingFilesSelector";
import ObjectSelector from "@ogw_front/components/ObjectSelector";
import Stepper from "@ogw_front/components/Stepper";
import { useStepperTree } from "@ogw_front/composables/stepper_tree.js";
import { useUIStore } from "@vease/stores/ui";

const emit = defineEmits(["close"]);
const UIStore = useUIStore();

const { files: initialFiles } = defineProps({
  files: { type: Array, default: () => [] },
});

const files = ref(initialFiles);
watch(
  () => initialFiles,
  (newVal) => {
    files.value = newVal;
  },
  { deep: true },
);

const auto_upload = ref(true);
const geode_object_type = ref("");
const additional_files = ref([]);

const stepper_tree = useStepperTree(
  [
    {
      step_title: "Select files to import",
      component: {
        component_name: shallowRef(FileSelector),
        component_options: {
          multiple: true,
          files,
          auto_upload,
          show_overlay: false,
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
      chips: computed(() => (geode_object_type.value === "" ? [] : [geode_object_type.value])),
    },
    {
      step_title: "Add additional files",
      component: {
        component_name: shallowRef(MissingFilesSelector),
        component_options: {
          multiple: true,
          geodeObjectType: geode_object_type,
          filenames: computed(() => files.value.map((file) => file.name)),
        },
      },
      chips: computed(() => additional_files.value.map((file) => file.name)),
    },
    {
      step_title: "Finalize import",
      component: {
        component_name: shallowRef(ImportFile),
        component_options: {
          geodeObjectType: geode_object_type,
          filenames: computed(() => files.value.map((file) => file.name)),
        },
      },
      chips: computed(() => {
        const output_params = [geode_object_type.value, additional_files.value];
        return output_params.filter((val) => val !== "" && (!Array.isArray(val) || val.length > 0));
      }),
    },
  ],
  {
    files,
    auto_upload,
    geode_object_type,
    additional_files,
  },
);

function reset_values() {
  UIStore.setDroppedFiles([]);
  stepper_tree.reset_values();
}

function handleClose() {
  reset_values();
  emit("close");
}

watch(
  () => UIStore.showStepper,
  (newVal) => {
    if (!newVal) {
      reset_values();
    }
  },
);
</script>

<template>
  <Stepper :stepper-tree="stepper_tree" @close="handleClose" @reset_values="reset_values" />
</template>
