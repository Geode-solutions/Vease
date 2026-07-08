<script setup>
import GlassCard from "@ogw_front/components/GlassCard";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();
const selectedTool = ref(undefined);

function getToolComponent(toolId) {
  return UIStore.toolsDefinitions.find((tool) => tool.id === toolId)?.component;
}

function handleSelectTool(toolId) {
  selectedTool.value = toolId;
}

function handleBack() {
  selectedTool.value = undefined;
}

function handleToolCreated() {
  selectedTool.value = undefined;
  UIStore.setShowCreateTools(false);
}

watch(
  () => UIStore.showCreateTools,
  (newVal) => {
    if (!newVal) {
      selectedTool.value = undefined;
    }
  },
);
</script>

<template>
  <v-card v-if="!selectedTool" flat color="transparent" class="d-flex flex-column h-100 w-100">
    <div class="flex-shrink-0 pa-3 pb-1">
      <div class="d-flex align-center mb-1">
        <v-icon icon="mdi-creation" class="mr-2 text-white" size="20"></v-icon>
        <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Create New Object</h2>
      </div>
      <p class="text-caption text-white opacity-70 mb-0">Choose a drawing tool to get started.</p>
    </div>

    <v-card-text class="pt-2 pb-6 flex-grow-1 overflow-y-auto px-3">
      <v-row dense>
        <v-col v-for="tool in UIStore.activeTools" :key="tool.id" cols="12" class="d-flex pa-1">
          <GlassCard
            variant="ui"
            class="cursor-pointer flex-grow-1 custom-tool-card"
            padding="pa-2"
            :data-testid="'createToolCard-' + tool.id"
            @click="handleSelectTool(tool.id)"
          >
            <div class="d-flex align-center ga-2 w-100">
              <v-sheet
                class="d-flex align-center justify-center rounded-circle flex-shrink-0"
                color="rgba(255, 255, 255, 0.1)"
                :width="36"
                :height="36"
                elevation="0"
                :style="{ transition: 'all 0.3s ease' }"
              >
                <v-icon
                  v-if="tool.iconType === 'mdi'"
                  :icon="tool.iconSource"
                  size="18"
                  color="white"
                />
                <v-img
                  v-else-if="tool.iconType === 'svg'"
                  :src="tool.iconSource"
                  :alt="tool.title + ' icon'"
                  height="18"
                  width="18"
                  contain
                  class="white-svg-filter"
                />
              </v-sheet>
              <div class="min-w-0 flex-grow-1 text-left">
                <div class="text-caption font-weight-bold text-white mb-1" style="line-height: 1.2">
                  {{ tool.title }}
                </div>
                <div
                  class="text-caption text-white opacity-70 text-wrap mt-0.5"
                  style="font-size: 0.72rem !important; line-height: 1.2"
                >
                  {{ tool.description }}
                </div>
              </div>
            </div>
          </GlassCard>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <div v-else class="position-relative tool-component-wrapper pa-2 d-flex flex-column h-100">
    <GlassCard
      variant="panel"
      padding="pa-0"
      class="ma-0 position-sticky back-btn rounded-circle"
      width="32"
      height="32"
    >
      <v-btn icon variant="text" size="small" @click="handleBack" class="w-100 h-100">
        <v-icon color="white" size="16">mdi-arrow-left</v-icon>
      </v-btn>
    </GlassCard>
    <GlassCard
      variant="panel"
      padding="pa-3"
      class="mt-2 flex-grow-1 overflow-hidden d-flex flex-column"
    >
      <component
        v-if="getToolComponent(selectedTool)"
        :is="getToolComponent(selectedTool)"
        @close="handleBack"
        @created="handleToolCreated"
      />
      <v-alert v-else type="error" variant="tonal" class="ma-2 text-caption">
        Component not found for **{{ selectedTool }}**. Please check the plugin registration.
      </v-alert>
    </GlassCard>
  </div>
</template>

<style scoped>
.back-btn {
  top: 0;
  z-index: 2;
}

.custom-tool-card {
  transition: all 0.2s ease-in-out;
}

.custom-tool-card:hover {
  transform: scale(1.02);
}

.tool-title {
  min-height: 2em;
  line-height: 1.2;
}

.tool-component-wrapper {
  min-height: 400px;
}

.white-svg-filter :deep(.v-img__img) {
  filter: brightness(0) invert(1) !important;
}
</style>
