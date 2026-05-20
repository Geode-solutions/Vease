<script setup>
import { ref, computed } from "vue";
import { useExtensions } from "@vease/composables/extensions";
import GlassCard from "@ogw_front/components/GlassCard";
import Extension from "@vease/components/Extension.vue";

const { allowedExtensions } = useExtensions();
const { data: extensions, pending, error } = await useAsyncData('extensions', () => allowedExtensions());

const searchQuery = ref("");
const selectedExtension = ref(null);
const currentTab = ref("marketplace");

const filteredExtensions = computed(() => {
  if (!extensions.value) return [];
  if (!searchQuery.value) return extensions.value;
  return extensions.value.filter((ext) =>
    ext.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (ext.description && ext.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

function selectExtension(ext) {
  selectedExtension.value = ext;
}
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column fill-height" theme="dark">
    <!-- Header Area -->
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

      <v-tabs v-model="currentTab" color="white" slider-color="white" class="border-b border-white border-opacity-10">
        <v-tab value="marketplace" class="text-none font-weight-medium text-white">
          <v-icon start>mdi-storefront</v-icon> Marketplace
        </v-tab>
        <v-tab value="installed" class="text-none font-weight-medium text-white">
          <v-icon start>mdi-check-circle-outline</v-icon> Installed
        </v-tab>
      </v-tabs>
    </div>

    <!-- Ensure v-window takes up the remaining height properly so scrolling works -->
    <v-window v-model="currentTab" class="flex-grow-1 extension-window" :touch="false">
      <!-- MARKETPLACE TAB -->
      <v-window-item value="marketplace" class="fill-height px-6 pb-6">
        <v-row class="fill-height ma-0 pt-4">
          <!-- Sidebar -->
          <v-col cols="12" md="4" lg="3" class="pl-0 py-0 pr-4 d-flex flex-column fill-height">
            <GlassCard variant="ui" padding="pa-0" class="d-flex flex-column fill-height border-white border-opacity-10">
              <div class="pa-4 border-b border-white border-opacity-10">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search Marketplace..."
                  variant="solo-filled"
                  density="compact"
                  hide-details
                  rounded="lg"
                  bg-color="rgba(0,0,0,0.2)"
                  color="white"
                  class="text-white"
                ></v-text-field>
              </div>

              <div class="flex-grow-1 overflow-y-auto pa-2 custom-scrollbar">
                <div v-if="pending" class="d-flex justify-center pa-6">
                  <v-progress-circular indeterminate color="white"></v-progress-circular>
                </div>
                <div v-else-if="error" class="text-white pa-4 text-center">
                  Failed to load extensions
                </div>
                <div v-else-if="filteredExtensions.length === 0" class="text-white text-center pa-6 opacity-80">
                  <v-icon icon="mdi-magnify-close" size="48" class="mb-3 opacity-80"></v-icon>
                  <div>No extensions found</div>
                </div>
                <v-list v-else bg-color="transparent" class="pa-0">
                  <v-list-item
                    v-for="ext in filteredExtensions"
                    :key="ext.id"
                    :value="ext.id"
                    :active="selectedExtension?.id === ext.id"
                    active-color="white"
                    class="mb-2 rounded-lg ext-item transition-all"
                    @click="selectExtension(ext)"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="rgba(255,255,255,0.08)" rounded="lg" class="mr-3">
                        <v-icon icon="mdi-puzzle-outline" color="white" size="24"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-semibold text-white mb-1">
                      {{ ext.id }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption text-white opacity-70">
                      v{{ ext.version }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </GlassCard>
          </v-col>

          <!-- Main Content -->
          <v-col cols="12" md="8" lg="9" class="pr-0 py-0 pl-2 d-flex flex-column fill-height">
            <GlassCard variant="ui" padding="pa-0" class="d-flex flex-column fill-height border-white border-opacity-10 relative overflow-hidden">
              <template v-if="selectedExtension">
                <!-- Header -->
                <div class="pa-8 border-b border-white border-opacity-10 bg-black-opacity-20">
                  <div class="d-flex align-start">
                    <v-avatar color="rgba(255,255,255,0.05)" size="96" rounded="xl" class="mr-6 border border-white border-opacity-10 shadow-sm glass-icon">
                      <v-icon icon="mdi-puzzle" size="48" color="white"></v-icon>
                    </v-avatar>

                    <div class="flex-grow-1">
                      <div class="d-flex align-center mb-2">
                        <h1 class="text-h4 font-weight-bold text-white mr-4">
                          {{ selectedExtension.id }}
                        </h1>
                        <v-chip size="small" variant="outlined" color="white" class="font-weight-medium">
                          v{{ selectedExtension.version }}
                        </v-chip>
                      </div>

                      <div class="text-subtitle-1 text-white opacity-80 mb-4">
                        Marketplace Extension
                      </div>

                      <div class="d-flex align-center ga-3 mt-4">
                        <v-btn color="white" variant="elevated" prepend-icon="mdi-download" elevation="4" rounded="pill" class="text-none px-6 font-weight-bold text-black">
                          Install Extension
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Readme -->
                <div class="flex-grow-1 pa-8 overflow-y-auto custom-scrollbar bg-transparent">
                  <h3 class="text-h6 font-weight-semibold text-white mb-4 d-flex align-center">
                    <v-icon icon="mdi-file-document-outline" class="mr-2" size="24"></v-icon>
                    Details
                  </h3>
                  <div class="readme-content text-body-1 text-white opacity-80">
                    <div v-if="selectedExtension.readme" style="white-space: pre-wrap; line-height: 1.6;">
                      {{ selectedExtension.readme }}
                    </div>
                    <div v-else class="text-center py-10 opacity-60">
                      <p>No README provided for this extension.</p>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Empty State -->
              <div v-else class="fill-height d-flex flex-column align-center justify-center text-center pa-6">
                <v-sheet
                  class="mx-auto mb-6 d-flex align-center justify-center"
                  rounded="circle"
                  color="rgba(255,255,255,0.05)"
                  width="120"
                  height="120"
                >
                  <v-icon icon="mdi-storefront-outline" size="64" color="white" class="opacity-80"></v-icon>
                </v-sheet>
                <h2 class="text-h5 font-weight-medium text-white mb-2">Marketplace</h2>
                <p class="text-body-1 text-white opacity-70">Select an extension from the list to view its details and install it.</p>
              </div>
            </GlassCard>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- INSTALLED TAB -->
      <v-window-item value="installed" class="fill-height">
        <div class="installed-container d-flex flex-column fill-height">
          <Extension class="flex-grow-1" />
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
.ext-item {
  border: 1px solid transparent;
}
.ext-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.ext-item.v-list-item--active {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-icon {
  backdrop-filter: blur(10px);
}

.bg-black-opacity-20 {
  background-color: rgba(0, 0, 0, 0.2);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Fix Vuetify v-window height for proper scrolling */
.extension-window {
  min-height: 0; /* important to allow shrinking flex children */
}
.extension-window :deep(.v-window__container) {
  height: 100%;
}

/* Hide the duplicate title from Extension.vue when rendered inside Installed tab */
.installed-container :deep(.pa-6 > .d-flex.align-center.mb-2) {
  display: none !important;
}
.installed-container :deep(.pa-6 > p.text-white.opacity-80) {
  display: none !important;
}
</style>
