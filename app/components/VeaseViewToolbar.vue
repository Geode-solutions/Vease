<template>
  <v-container :class="[$style.floatToolbar, 'pa-0']" width="auto">
    <v-row
      v-for="camera_option in camera_options"
      :key="camera_option.icon"
      dense
    >
      <v-col>
        <v-btn
          density="comfortable"
          icon
          @click.stop="camera_option.action"
          v-tooltip:left="camera_option.tooltip"
        >
          <v-icon :icon="camera_option.icon" size="32" />
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <Screenshot :show_dialog="take_screenshot" @close="take_screenshot = false" />
  <ZScaling
    v-if="showZScaling"
    v-model="zScale"
    :width="400"
    @close="handleZScalingClose"
  />
</template>

<script setup>
import schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

const hybridViewerStore = useHybridViewerStore();
const take_screenshot = ref(false);
const showZScaling = ref(false);
const grid_scale = ref(false);
const zScale = ref(hybridViewerStore.zScale);

watch(
  () => hybridViewerStore.zScale,
  (newVal) => {
    zScale.value = newVal;
  }
);

const handleZScalingClose = async () => {
  await hybridViewerStore.setZScaling(zScale.value);
  showZScaling.value = false;
};

const camera_options = [
  {
    tooltip: "Reset camera",
    icon: "mdi-cube-scan",
    action: () => {
      const { genericRenderWindow } = storeToRefs(hybridViewerStore);
      const renderWindow = genericRenderWindow.value.value.getRenderWindow();
      const renderer = renderWindow.getRenderers()[0];
      renderer.resetCamera();
      renderWindow.render();
      hybridViewerStore.syncRemoteCamera();
    },
  },
  {
    tooltip: "Take a screenshot",
    icon: "mdi-camera",
    action: () => {
      take_screenshot.value = !take_screenshot.value;
    },
  },
  {
    tooltip: "Toggle grid scale",
    icon: "mdi-ruler-square",
    action: () => {
      viewer_call(
        {
          schema: schemas.opengeodeweb_viewer.viewer.grid_scale,
          params: {
            visibility: !grid_scale.value,
          },
        },
        {
          response_function: () => {
            grid_scale.value = !grid_scale.value;
          },
        }
      );
    },
  },
  {
    tooltip: "Z Scaling Control",
    icon: "mdi-sort",
    action: () => {
      showZScaling.value = !showZScaling.value;
    },
  },
];
</script>

<style module>
.floatToolbar {
  position: absolute;
  z-index: 2;
  right: 20px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0);
}
</style>
