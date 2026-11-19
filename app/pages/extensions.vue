<script setup lang="ts">
import Extension from "@vease/components/Extension.vue";
import Marketplace from "@vease/components/Extensions/Marketplace.vue";
import PageHeader from "@vease/components/Layout/PageHeader.vue";

const currentTab = ref("marketplace");
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column fill-height">
    <div class="px-8 pt-8 pb-2">
      <PageHeader
        title="Extensions"
        subtitle="Enhance your application with additional features and tools from the marketplace."
        class="mb-4"
      />

      <v-tabs v-model="currentTab" color="primary" slider-color="primary" class="border-b">
        <v-tab value="marketplace" class="text-none font-weight-medium">
          <v-icon start>ph-storefront</v-icon> Marketplace
        </v-tab>
        <v-tab value="installed" class="text-none font-weight-medium">
          <v-icon start>ph-check-circle</v-icon> Installed
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
        class="fill-height px-8 pb-8 overflow-y-auto custom-scrollbar"
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
