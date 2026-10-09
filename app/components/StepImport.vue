<script setup lang="ts">
import { type UploadFile, fileExtension, uploadPath } from "@ogw_front/utils/upload_path";
import ApplyTimeSeries from "@vease/components/ApplyTimeSeries.vue";
import FileSelector from "@ogw_front/components/FileSelector.vue";
import ImportFile from "@vease/components/ImportFile.vue";
import MissingFilesSelector from "@ogw_front/components/MissingFilesSelector.vue";
import ObjectSelector from "@ogw_front/components/ObjectSelector.vue";
import Stepper from "@ogw_front/components/Stepper.vue";
import TimeSeriesTargetSelector from "@ogw_front/components/TimeSeriesTargetSelector.vue";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useStepperTree } from "@ogw_front/composables/stepper_tree.js";
import { useUIStore } from "@vease/stores/ui";

const emit = defineEmits<{ close: [] }>();
const UIStore = useUIStore();

const { files: initialFiles = [] } = defineProps<{ files?: File[] }>();

const files = ref<UploadFile[]>(initialFiles);
watch(
  () => initialFiles,
  (newVal) => {
    files.value = newVal;
  },
  { deep: true },
);

const autoUpload = ref(true);
const geode_object_type = ref("");
const additional_files = ref<File[]>([]);
const target_id = ref("");
// Time series extensions, given by the file selector along with the selected files
const time_series = ref<string[]>([]);
const time_series_files = computed(() =>
  files.value.filter((file) => time_series.value.includes(fileExtension(uploadPath(file)))),
);
// A time series file is imported alone; its referenced files come in the additional files step.
const main_time_series_path = computed(() => {
  const [single_file] = time_series_files.value;
  return files.value.length === 1 && single_file ? uploadPath(single_file) : "";
});

const select_files_step = {
  step_title: "Select files to import",
  component: {
    component_name: shallowRef(FileSelector),
    component_options: {
      multiple: true,
      files,
      autoUpload,
      showOverlay: false,
      timeSeries: true,
    },
  },
  chips: computed(() => files.value.map((file) => uploadPath(file))),
};

const import_steps = [
  select_files_step,
  {
    step_title: "Confirm data type",
    component: {
      component_name: shallowRef(ObjectSelector),
      component_options: {
        filenames: computed(() => files.value.map((file) => uploadPath(file))),
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
        filenames: computed(() => files.value.map((file) => uploadPath(file))),
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
        filenames: computed(() => files.value.map((file) => uploadPath(file))),
      },
    },
    chips: computed(() => {
      const output_params = [geode_object_type.value, additional_files.value];
      return output_params.filter((val) => val !== "" && (!Array.isArray(val) || val.length > 0));
    }),
  },
];

const time_series_steps = [
  select_files_step,
  {
    step_title: "Select target model",
    component: {
      component_name: shallowRef(TimeSeriesTargetSelector),
      component_options: { filename: main_time_series_path },
    },
    chips: computed(() => (target_id.value === "" ? [] : [geode_object_type.value])),
  },
  {
    step_title: "Add additional files",
    component: {
      component_name: shallowRef(MissingFilesSelector),
      component_options: {
        multiple: true,
        geodeObjectType: geode_object_type,
        filenames: computed(() => [main_time_series_path.value]),
        timeSeries: true,
      },
    },
    chips: computed(() => additional_files.value.map((file) => uploadPath(file))),
  },
  {
    step_title: "Apply time series",
    component: {
      component_name: shallowRef(ApplyTimeSeries),
      component_options: {
        filename: main_time_series_path,
        targetId: target_id,
      },
    },
    chips: computed(() => []),
  },
];

const stepper_tree = useStepperTree(import_steps, {
  files,
  autoUpload,
  geode_object_type,
  additional_files,
  target_id,
  time_series,
});

function reset_values(): void {
  UIStore.setDroppedFiles([]);
  stepper_tree.reset_values();
}

function handleClose(): void {
  reset_values();
  emit("close");
}

watch(main_time_series_path, (path) => {
  stepper_tree.state.steps = path === "" ? import_steps : time_series_steps;
});

watch(
  () => time_series_files.value.length > 0 && files.value.length > 1,
  (is_mixed) => {
    if (is_mixed) {
      useFeedbackStore().add_warning("Import the time series file alone");
      reset_values();
    }
  },
);

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
  <div class="d-flex flex-column fill-height overflow-hidden">
    <Stepper :stepperTree="stepper_tree" @close="handleClose" @reset_values="reset_values" />
  </div>
</template>
