<script setup>
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()

  function getToolComponent(toolId) {
    return UIStore.toolsDefinitions.find((tool) => tool.id === toolId)
      ?.component
  }

  function handleSelectTool(toolId) {
    UIStore.setSelectedTool(toolId)
  }

  function handleBack() {
    UIStore.setSelectedTool(null)
  }

  function handleToolCreated() {
    UIStore.setSelectedTool(null)
    UIStore.setShowCreateTools(false)
  }

  watch(
    () => UIStore.showCreateTools,
    (newVal) => {
      if (!newVal) {
        UIStore.setSelectedTool(null)
      }
    },
  )
</script>

<template>
  <v-card
    v-if="!UIStore.selectedTool"
    :width="500"
    flat
    color="transparent"
    class="d-flex flex-column h-100"
  >
    <div class="flex-shrink-0 pa-6">
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-creation" class="mr-3 title-text" size="32"></v-icon>
        <h2 class="title-text">Create New Object</h2>
      </div>
      <p class="text-white">Choose a drawing tool to get started.</p>
    </div>

    <v-card-text class="pt-2 pb-8 flex-1-1 overflow-y-auto px-6">
      <v-row>
        <v-col
          v-for="tool in UIStore.activeTools"
          :key="tool.id"
          cols="6"
          class="d-flex pa-2"
        >
          <v-hover v-slot="{ isHovering, props }">
            <GlassCard
              v-bind="props"
              variant="ui"
              class="text-center cursor-pointer flex-grow-1 d-flex flex-column custom-tool-card"
              :class="{
                'bg-white-opacity-10': isHovering,
              }"
              padding="pa-4"
              @click="handleSelectTool(tool.id)"
            >
              <v-card-text class="pa-0 d-flex flex-column flex-grow-1">
                <v-sheet
                  class="d-flex align-center justify-center pa-4 rounded-circle mb-4 mx-auto"
                  color="rgba(255, 255, 255, 0.1)"
                  :width="70"
                  :height="70"
                  elevation="0"
                  :style="{ transition: 'all 0.3s ease' }"
                  :class="{ 'bg-primary': isHovering }"
                >
                  <v-icon
                    v-if="tool.iconType === 'mdi'"
                    :icon="tool.iconSource"
                    size="36"
                    color="white"
                  />
                  <v-img
                    v-else-if="tool.iconType === 'svg'"
                    :src="tool.iconSource"
                    :alt="tool.title + ' icon'"
                    height="36"
                    width="36"
                    contain
                    class="svg-white-filter"
                  />
                </v-sheet>
                <div
                  class="text-h6 font-weight-bold mb-1 text-wrap tool-title text-white"
                >
                  {{ tool.title }}
                </div>
                <div class="text-caption text-wrap text-white opacity-85">
                  {{ tool.description }}
                </div>
              </v-card-text>
            </GlassCard>
          </v-hover>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <div v-else class="position-relative tool-component-wrapper pa-4">
    <GlassCard
      variant="panel"
      padding="pa-0"
      class="ma-2 position-sticky back-btn rounded-circle"
      width="48"
      height="48"
    >
      <v-btn icon variant="text" @click="handleBack" class="w-100 h-100">
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-btn>
    </GlassCard>
    <GlassCard variant="panel" padding="pa-6" class="mt-4">
      <component
        v-if="getToolComponent(selectedTool)"
        :is="getToolComponent(selectedTool)"
        @close="handleBack"
        @created="handleToolCreated"
      />
      <v-alert v-else type="error" variant="tonal" class="ma-4">
        Component not found for **{{ selectedTool }}**. Please check the plugin
        registration.
      </v-alert>
    </GlassCard>
  </div>
</template>

<style scoped>
  .back-btn {
    top: 0;
    z-index: 10;
  }

  .custom-tool-card {
    transition: all 0.2s ease-in-out;
  }

  .custom-tool-card:hover {
    transform: scale(1.03);
  }

  .svg-white-filter {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
      brightness(100%) contrast(100%);
  }

  .tool-title {
    min-height: 2em;
    line-height: 1.2;
  }

  .tool-component-wrapper {
    min-height: 400px;
  }
</style>
