<template>
  <div class="glass-header pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 text-white font-weight-light">Data Manager</h2>

      <v-btn-toggle
        :model-value="viewMode"
        @update:model-value="$emit('update:viewMode', $event)"
        mandatory
        density="compact"
        theme="dark"
        variant="outlined"
        divided
      >
        <v-btn value="list" icon="mdi-view-list" size="small" />
        <v-btn value="grid" icon="mdi-view-grid" size="small" />
      </v-btn-toggle>
    </div>

    <v-text-field
      :model-value="searchValue"
      @update:model-value="$emit('update:searchValue', $event)"
      prepend-inner-icon="mdi-magnify"
      label="Search data (Ctrl+K)"
      variant="solo"
      density="compact"
      hide-details
      flat
      rounded="lg"
      clearable
      class="search-field"
      ref="searchInput"
    />

    <v-tabs
      v-if="tabs.length > 0"
      :model-value="activeTab"
      @update:model-value="$emit('update:activeTab', $event)"
      bg-color="transparent"
      color="primary"
      class="mt-4"
      density="compact"
    >
      <v-tab value="data" class="text-none">Data</v-tab>
      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        class="text-none"
      >
        {{ tab.title }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script setup>
  const props = defineProps({
    searchValue: {
      type: String,
      default: "",
    },
    viewMode: {
      type: String,
      default: "list",
      validator: (val) => ["list", "grid"].includes(val),
    },
    activeTab: {
      type: String,
      default: "data",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  })

  defineEmits(["update:searchValue", "update:viewMode", "update:activeTab"])

  const searchInput = useTemplateRef("searchInput")

  function focusSearch() {
    searchInput.value?.focus()
  }

  defineExpose({
    focusSearch,
  })
</script>

<style scoped>
  .glass-header {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .search-field :deep(.v-field) {
    background: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }
</style>
