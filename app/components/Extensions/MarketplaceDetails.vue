<script setup>
import GlassCard from "@ogw_front/components/GlassCard";
import { importExtensionFile } from "@ogw_front/utils/extension";
import { useAppStore } from "@ogw_front/stores/app";

import { useExtensions } from "@vease/composables/extensions";

const { extension } = defineProps({
  extension: {
    type: Object,
    default: undefined,
  },
});

const MESSAGE_TIMEOUT = 5000;

const { downloadExtension } = useExtensions();
const appStore = useAppStore();

const installing = ref(false);
const installError = ref("");
const installSuccess = ref("");
const installed = computed(() => {
  if (!appStore.getExtension(extension.id)) {
    return false;
  }
  return true;
});
console.log({ installed });

async function installSelectedExtension() {
  if (!extension) {
    return;
  }

  installError.value = "";
  installSuccess.value = "";
  installing.value = true;

  try {
    const file = await downloadExtension(extension.id);
    console.log({ file });
    await importExtensionFile(file);
    installSuccess.value = "Extension installed successfully!";
  } catch (error) {
    console.error(error);
    installError.value = error.message || "Failed to install extension.";
  } finally {
    installing.value = false;
    setTimeout(() => {
      installSuccess.value = "";
      installError.value = "";
    }, MESSAGE_TIMEOUT);
  }
}
</script>
<template>
  <GlassCard
    variant="ui"
    padding="pa-0"
    class="d-flex flex-column fill-height border-white border-opacity-10 relative overflow-hidden"
    style="min-height: 0"
  >
    <template v-if="extension">
      <v-sheet color="rgba(0,0,0,0.2)" class="pa-6 pa-sm-8 border-b border-white border-opacity-10">
        <v-sheet
          color="transparent"
          class="d-flex flex-column flex-sm-row align-center align-sm-start text-center text-sm-left"
        >
          <v-avatar
            color="rgba(255,255,255,0.05)"
            size="96"
            rounded="xl"
            class="mb-4 mb-sm-0 mr-sm-6 border border-white border-opacity-10 shadow-sm glass-icon flex-shrink-0"
          >
            <v-icon icon="mdi-puzzle" size="48" color="white"></v-icon>
          </v-avatar>

          <v-sheet color="transparent" class="flex-grow-1 w-100" style="min-width: 0">
            <v-sheet
              color="transparent"
              class="d-flex flex-column flex-sm-row align-center mb-2 justify-center justify-sm-start"
            >
              <h1
                class="text-h5 text-sm-h4 font-weight-bold text-white mb-2 mb-sm-0 mr-sm-4"
                style="word-break: break-word"
              >
                {{ extension.id }}
              </h1>
              <v-chip size="small" variant="outlined" color="white" class="font-weight-medium">
                v{{ extension.version }}
              </v-chip>
            </v-sheet>

            <v-sheet color="transparent" class="text-subtitle-1 text-white opacity-80 mb-4">
              Marketplace Extension
            </v-sheet>

            <v-sheet
              color="transparent"
              class="d-flex align-center justify-center justify-sm-start ga-3 mt-4"
            >
              <v-btn
                color="white"
                variant="elevated"
                prepend-icon="mdi-download"
                elevation="4"
                rounded="pill"
                class="text-none px-6 font-weight-bold text-black"
                :loading="installing"
                @click="installSelectedExtension"
                :disabled="installed"
              >
                <span v-if="installed">Already installed</span>
                <span v-else>Install Extension</span>
              </v-btn>
            </v-sheet>

            <v-slide-y-transition>
              <v-alert
                v-if="installSuccess"
                type="success"
                density="compact"
                variant="tonal"
                class="mt-4 text-caption"
              >
                {{ installSuccess }}
              </v-alert>
            </v-slide-y-transition>

            <v-slide-y-transition>
              <v-alert
                v-if="installError"
                type="error"
                density="compact"
                variant="tonal"
                class="mt-4 text-caption"
              >
                {{ installError }}
              </v-alert>
            </v-slide-y-transition>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <v-sheet
        color="transparent"
        class="flex-grow-1 pa-6 pa-sm-8 overflow-y-auto custom-scrollbar"
      >
        <h3 class="text-h6 font-weight-semibold text-white mb-4 d-flex align-center">
          <v-icon icon="mdi-file-document-outline" class="mr-2" size="24"></v-icon>
          Details
        </h3>
        <v-sheet color="transparent" class="readme-content text-body-1 text-white opacity-80">
          <v-sheet
            v-if="extension.readme"
            color="transparent"
            style="white-space: pre-wrap; line-height: 1.6"
          >
            {{ extension.readme }}
          </v-sheet>
          <v-sheet v-else color="transparent" class="text-center py-10 opacity-60">
            <p>No README provided for this extension.</p>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </template>

    <v-sheet
      v-else
      color="transparent"
      class="fill-height d-flex flex-column align-center justify-center text-center pa-6"
    >
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
      <p class="text-body-1 text-white opacity-70">
        Select an extension from the list to view its details and install it.
      </p>
    </v-sheet>
  </GlassCard>
</template>

<style scoped>
.glass-icon {
  backdrop-filter: blur(10px);
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
</style>
