<script setup>
import Extension from "@vease/components/Extension.vue";
import Marketplace from "@vease/components/Extensions/Marketplace.vue";

const currentTab = ref("marketplace");
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column fill-height" theme="dark">
    <div class="px-6 pt-6 pb-2">
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-puzzle" class="mr-3 text-white" size="32"></v-icon>
          <h2 class="text-h4 font-weight-bold text-white">Extensions</h2>
        </div>
      </div>
      <p class="text-white opacity-80 mb-4">
        Enhance your application with additional features and tools from the marketplace.
      </p>

      <v-tabs
        v-model="currentTab"
        color="white"
        slider-color="white"
        class="border-b border-white border-opacity-10"
      >
        <v-tab value="marketplace" class="text-none font-weight-medium text-white">
          <v-icon start>mdi-storefront</v-icon> Marketplace
        </v-tab>
        <v-tab value="installed" class="text-none font-weight-medium text-white">
          <v-icon start>mdi-check-circle-outline</v-icon> Installed
        </v-tab>
      </v-tabs>
    </div>

    <v-window
      v-model="currentTab"
      class="flex-grow-1 extension-window d-flex flex-column"
      :touch="false"
    >
      <v-window-item
        value="marketplace"
        class="fill-height px-6 pb-6 overflow-y-auto custom-scrollbar"
      >
        <Marketplace />
      </v-window-item>

      <v-window-item value="installed" class="fill-height overflow-y-auto custom-scrollbar">
        <div class="installed-container d-flex flex-column fill-height">
          <Extension class="flex-grow-1" :hide-header="true" />
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
.extension-window {
  min-height: 0;
}
.extension-window :deep(.v-window__container) {
  flex-grow: 1;
  min-height: 0;
}
</style>
