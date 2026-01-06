<template>
  <v-sheet class="pa-6 pb-2" rounded="xl" color="transparent">
    <v-tabs
      :model-value="activeTab"
      @update:model-value="$emit('update:activeTab', $event)"
      bg-color="transparent"
      color="white"
      class="mb-6 border-b-thin"
      height="48"
      hide-slider
      selected-class="tab-active"
    >
      <v-tab
        value="data"
        class="text-none font-weight-medium px-6 rounded-t-lg tab-item"
      >
        <v-icon start size="20">mdi-database</v-icon>
        Data Manager
      </v-tab>

      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        class="text-none font-weight-medium px-6 rounded-t-lg tab-item"
      >
        <v-icon v-if="tab.icon" start size="20">{{ tab.icon }}</v-icon>
        {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-text-field
      :model-value="searchValue"
      @update:model-value="$emit('update:searchValue', $event)"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search your data..."
      variant="solo"
      density="comfortable"
      hide-details
      flat
      clearable
      bg-color="transparent"
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
    </v-text-field>
  </v-sheet>
</template>

<script setup>
  import { useTemplateRef } from "vue"

  const props = defineProps({
    searchValue: { type: String, default: "" },
    activeTab: { type: String, default: "data" },
    tabs: { type: Array, default: () => [] },
  })

  defineEmits(["update:searchValue", "update:activeTab"])
  const searchInput = useTemplateRef("searchInput")

  defineExpose({ focusSearch: () => searchInput.value?.focus() })
</script>

<style scoped>
  .tab-item {
    transition: background 0.2s ease-in-out;
    opacity: 0.7;
  }

  .tab-item:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
  }

  .tab-active {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-bottom: none !important;
    margin-bottom: -1px;
  }
</style>
