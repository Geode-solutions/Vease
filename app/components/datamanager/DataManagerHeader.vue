<script setup>
  import SearchBar from "@ogw_front/components/SearchBar.vue"
  import { useTemplateRef } from "vue"
  import { useUIStore } from "@vease/stores/ui"

  const UIStore = useUIStore()

  const { searchValue, activeTab, tabs, compact } = defineProps({
    searchValue: { type: String, default: "" },
    activeTab: { type: String, default: "data" },
    tabs: { type: Array, default: () => [] },
    compact: { type: Boolean, default: false },
  })

  const emit = defineEmits(["update:searchValue", "update:activeTab"])
  const searchInput = useTemplateRef("searchInput")

  function enterPiP() {
    UIStore.setShowDataManagerPiP(true)
    navigateTo("/")
  }

  defineExpose({ focusSearch: () => searchInput.value?.focus() })
</script>

<template>
  <div :class="[compact ? 'px-0 py-1 pb-0' : 'px-0 py-8 pb-2']">
    <v-tabs
      :model-value="activeTab"
      @update:model-value="emit('update:activeTab', $event)"
      bg-color="transparent"
      color="primary"
      :class="[compact ? 'mb-2' : 'mb-6', 'border-b-thin']"
      height="48"
      selected-class="bg-primary text-white"
    >
      <v-tab
        value="data"
        class="text-none font-weight-medium px-6 rounded-t-lg"
        :variant="activeTab === 'data' ? 'elevated' : 'text'"
        :elevation="activeTab === 'data' ? 4 : 0"
        :border="activeTab === 'data' ? true : false"
      >
        <v-icon start size="20">mdi-database</v-icon>
        Data Manager
      </v-tab>

      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        class="text-none font-weight-medium px-6 rounded-t-lg"
        :variant="activeTab === tab.id ? 'elevated' : 'text'"
        :elevation="activeTab === tab.id ? 4 : 0"
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
        color="white"
        class="align-self-center mr-2"
        @click="enterPiP"
      >
        <v-icon size="30">mdi-picture-in-picture-bottom-right</v-icon>
        <v-tooltip activator="parent" location="top"
          >Picture in Picture</v-tooltip
        >
      </v-btn>
    </v-tabs>

    <SearchBar
      :model-value="searchValue"
      @update:model-value="emit('update:searchValue', $event)"
      placeholder="Search your data..."
      clearable
      class="border-thin rounded-lg text-white"
      ref="searchInput"
    >
      <template #append-inner>
        <v-chip
          size="small"
          variant="tonal"
          color="grey-lighten-1"
          class="text-caption font-weight-bold"
        >
          Ctrl+K
        </v-chip>
      </template>
    </SearchBar>
  </div>
</template>
