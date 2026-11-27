<script setup lang="ts">
import {
  type DataManagerTab,
  type DataManagerTabId,
  useUserInterfaceStore,
} from "@vease/stores/user_interface";
import SearchBar from "@ogw_front/components/SearchBar.vue";
import { useTemplateRef } from "vue";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { SearchQuery } from "@ogw_front/types/ui";

interface Props {
  searchValue: SearchQuery;
  activeTab: DataManagerTabId;
  tabs: DataManagerTab[];
  compact: boolean;
}

interface Emits {
  "update:searchValue": [value: SearchQuery];
  "update:activeTab": [value: DataManagerTabId];
}

const userInterfaceStore = useUserInterfaceStore();

const { searchValue, activeTab, tabs, compact } = defineProps<Props>();

const emit = defineEmits<Emits>();
const searchInput = useTemplateRef("searchInput");

function enterPiP(): void {
  userInterfaceStore.setShowDataManagerPiP(true);
  navigateTo("/");
}

defineExpose({
  // SearchBar doesn't expose its internal input; focus() is a best-effort no-op
  // If the underlying instance doesn't provide one at runtime.
  focusSearch: () => (searchInput.value as { focus?: () => void } | null)?.focus?.(),
});
</script>

<template>
  <div :class="[compact ? 'px-0 py-1 pb-0' : 'px-0 pt-0 pb-2']">
    <v-tabs
      :model-value="activeTab"
      @update:model-value="emit('update:activeTab', $event)"
      bg-color="transparent"
      color="primary"
      :class="[compact ? 'mb-2' : 'mb-6', 'border-b-thin']"
      height="48"
      slider-color="primary"
    >
      <v-tab
        value="data"
        class="text-none font-weight-medium px-4"
        data-testid="dataManagerTab-data"
      >
        <v-icon start size="20">ph-database</v-icon>
        Data
      </v-tab>

      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        class="text-none font-weight-medium px-4"
        :data-testid="`dataManagerTab-${tab.id}`"
      >
        <v-icon v-if="tab.icon" start size="20">{{ tab.icon }}</v-icon>
        {{ tab.title }}
      </v-tab>

      <v-spacer />

      <v-btn
        v-if="!compact"
        icon
        size="small"
        variant="text"
        class="align-self-center mr-2"
        data-testid="dataManagerPiPButton"
        @click="enterPiP"
      >
        <v-icon size="30">ph-picture-in-picture</v-icon>
        <v-tooltip activator="parent" location="top">Picture in Picture</v-tooltip>
      </v-btn>
    </v-tabs>

    <SearchBar
      :model-value="searchValue"
      @update:model-value="emit('update:searchValue', $event)"
      placeholder="Search your data..."
      clearable
      class="border-thin rounded-lg"
      ref="searchInput"
    >
      <template #append-inner>
        <v-chip size="small" variant="tonal" class="text-caption font-weight-bold"> Ctrl+K </v-chip>
      </template>
    </SearchBar>
  </div>
</template>
