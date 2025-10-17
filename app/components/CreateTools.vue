<template>
  <v-card :width="500" flat class="pa-4">
    <v-card-title
      class="pb-2 text-h4 text-primary font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-creation" class="mr-3"></v-icon>
      Create New Object
    </v-card-title>

    <v-card-subtitle class="ma-0 text-medium-emphasis">
      Choose a drawing tool to get started.
    </v-card-subtitle>

    <v-card-text class="pt-6">
      <v-row>
        <v-col v-for="tool in tools" :key="tool.id" cols="6" class="d-flex">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="text-center pa-4 cursor-pointer transition-swing flex-grow-1 d-flex flex-column"
              :class="{
                'bg-blue-lighten-5': isHovering,
                'scale-103': isHovering,
              }"
              :elevation="isHovering ? 6 : 2"
              rounded="xl"
              @click="selectTool(tool.id)"
            >
              <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
                <div
                  class="d-flex align-center justify-center pa-4 rounded-circle mb-4 mx-auto"
                  :class="isHovering ? 'bg-primary' : 'bg-grey-lighten-3'"
                  style="width: 80px; height: 80px"
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
                    :class="{
                      'svg-white-filter': isHovering,
                    }"
                  />
                </div>

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
</template>

<script setup>
  const tools = [
    {
      id: "Point",
      title: "Specific Point",
      description:
        "Create a point object with exact coordinates on the viewer.",
      iconType: "mdi",
      iconSource: "mdi-circle-medium",
    },
    {
      id: "AOI",
      title: "Area of Interest",
      description: "Define an area of interest on the viewer with 4 points.",
      iconType: "svg",
      iconSource: "aoi.svg",
    },
  ]

  const emit = defineEmits(["select-tool"])
  const selectedTool = ref(null)

  const selectTool = (toolId) => {
    selectedTool.value = toolId
    emit("select-tool", toolId)
  }

  const isSelected = (toolId) =>
    computed(() => selectedTool.value === toolId).value
</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }

  .scale-103 {
    transform: scale(1.03);
  }

  .v-card {
    transition: all 0.2s ease-in-out;
  }

  .svg-white-filter {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)
      brightness(100%) contrast(100%);
  }

  .tool-title {
    min-height: 2em;
    line-height: 1.2;
  }
</style>
