<script setup>
import GlassCard from "@ogw_front/components/GlassCard";
import { useAppStore } from "@ogw_front/stores/app";

const { extensions, pending, fetchError, modelValue } = defineProps({
  extensions: {
    type: Array,
    default: [],
  },
  pending: {
    type: Boolean,
    default: false,
  },
  fetchError: {
    type: [Error, Object, Boolean],
    default: false,
  },
  modelValue: {
    type: Object,
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue"]);

const searchQuery = ref("");

const appStore = useAppStore();

const filteredExtensions = computed(() => {
  if (!extensions) {
    return [];
  }
  if (!searchQuery.value) {
    return extensions;
  }
  return extensions.filter(
    (ext) =>
      ext.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (ext.description && ext.description.toLowerCase().includes(searchQuery.value.toLowerCase())),
  );
});

function selectExtension(ext) {
  emit("update:modelValue", ext);
}

function extensionIcon(ext) {
  if (appStore.getExtension(ext.id)) {
    return "mdi-puzzle-check-outline";
  }

  return "mdi-puzzle-outline";
}
</script>

<template>
  <GlassCard
    variant="ui"
    padding="pa-0"
    class="d-flex flex-column fill-height border-white border-opacity-10"
    style="min-height: 0"
  >
    <v-sheet color="transparent" class="pa-4 border-b border-white border-opacity-10">
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
    </v-sheet>

    <v-sheet color="transparent" class="flex-grow-1 overflow-y-auto pa-2 custom-scrollbar">
      <v-sheet v-if="pending" color="transparent" class="d-flex justify-center pa-6">
        <v-progress-circular indeterminate color="white" />
      </v-sheet>
      <v-sheet v-else-if="fetchError" color="transparent" class="text-white pa-4 text-center">
        Failed to load extensions
      </v-sheet>
      <v-sheet
        v-else-if="filteredExtensions.length === 0"
        color="transparent"
        class="text-white text-center pa-6 opacity-80"
      >
        <v-icon icon="mdi-magnify-close" size="48" class="mb-3 opacity-80" />
        <div class="text-body-1">No extensions found</div>
      </v-sheet>
      <v-list v-else bg-color="transparent" class="pa-0">
        <v-list-item
          v-for="ext in filteredExtensions"
          :key="ext.id"
          :value="ext.id"
          :active="modelValue?.id === ext.id"
          color="white"
          class="mb-2 rounded-lg ext-item transition-all"
          @click="selectExtension(ext)"
        >
          <template v-slot:prepend>
            <v-avatar color="rgba(255,255,255,0.08)" rounded="lg" class="mr-3">
              <v-icon :icon="extensionIcon(ext)" color="white" size="24"></v-icon>
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
    </v-sheet>
  </GlassCard>
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
