<template>
  <v-card v-if="!selectedTool" :width="500" flat>
    <v-card-title
      class="text-h4 text-primary pa-4 font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-creation" class="mr-3"></v-icon>
      Create New Object
    </v-card-title>
    <v-card-subtitle class="ma-0 text-medium">
      Choose a drawing tool to get started.
    </v-card-subtitle>
    <v-card-text class="pt-6">
      <v-row>
        <v-col
          v-for="tool in UIStore.activeTools"
          :key="tool.id"
          cols="6"
          class="d-flex pa-2"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="text-center cursor-pointer flex-grow-1 d-flex flex-column custom-tool-card"
              :class="{
                'bg-blue-lighten-5': isHovering,
                'elevation-6': isHovering,
              }"
              :elevation="isHovering ? 6 : 2"
              rounded="xl"
              @click="handleSelectTool(tool.id)"
            >
              <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
                <v-sheet
                  class="d-flex align-center justify-center pa-4 rounded-circle mb-4 mx-auto"
                  :class="isHovering ? 'bg-primary' : 'bg-grey-lighten-3'"
                  :width="80"
                  :height="80"
                  elevation="0"
                >
                  <v-icon
                    v-if="tool.iconType === 'mdi'"
                    :icon="tool.iconSource"
                    size="48"
                    :color="isHovering ? 'white' : 'grey-darken-2'"
                  />
                  <v-img
                    v-else-if="tool.iconType === 'svg'"
                    :src="tool.iconSource"
                    :alt="tool.title + ' icon'"
                    height="48"
                    width="48"
                    contain
                    :class="{ 'svg-white-filter': isHovering }"
                  />
                </v-sheet>
                <v-card-title
                  class="text-h5 font-weight-bold mb-1 text-wrap tool-title"
                  :class="isHovering ? 'text-primary' : 'text-medium-emphasis'"
                >
                  {{ tool.title }}
                </v-card-title>
                <v-card-subtitle
                  class="text-caption text-wrap text-grey-darken-4"
                >
                  {{ tool.description }}
                </v-card-subtitle>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-sheet v-else class="tool-component-wrapper v-sheet-tool-wrapper">
    <v-btn
      icon
      variant="text"
      class="back-button ma-2 v-sheet-back-button"
      @click="handleBack"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <component
      v-if="getToolComponent(selectedTool)"
      :is="getToolComponent(selectedTool)"
      @close="handleBack"
      @created="handleToolCreated"
    />
    <v-alert v-else type="error" class="ma-4">
      Component not found for **{{ selectedTool }}**. Please check the plugin
      registration.
    </v-alert>
  </v-sheet>
</template>

<script setup>
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()
  const selectedTool = ref(null)

  const getToolComponent = (toolId) =>
    UIStore.toolsDefinitions.find((t) => t.id === toolId)?.component

  const handleSelectTool = (toolId) => {
    selectedTool.value = toolId
  }

  const handleBack = () => {
    selectedTool.value = null
  }

  const handleToolCreated = () => {
    selectedTool.value = null
    UIStore.setShowCreateTools(false)
  }

  watch(
    () => UIStore.showCreateTools,
    (newVal) => {
      if (!newVal) {
        selectedTool.value = null
      }
    },
  )
</script>

<style scoped>
  .custom-tool-card {
    transition: all 0.2s ease-in-out;
  }
  .custom-tool-card:hover {
    transform: scale(1.03);
  }

  .cursor-pointer {
    cursor: pointer;
  }
  .svg-white-filter {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
      brightness(100%) contrast(100%);
  }
  .tool-title {
    min-height: 2em;
    line-height: 1.2;
  }

  .v-sheet-tool-wrapper {
    position: relative;
    min-height: 400px;
  }

  .v-sheet-back-button {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
  }
</style>
