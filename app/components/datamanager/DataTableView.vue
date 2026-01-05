<template>
  <v-data-table
    :model-value="selectedIds"
    @update:model-value="$emit('update:selectedIds', $event)"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    theme="dark"
    hover
    class="custom-table"
    item-value="id"
    return-object
    height="580"
  >
    <template v-slot:item.name="{ item }">
      <span
        class="font-weight-medium cursor-pointer text-white title-hover"
        @click="$emit('rename', item)"
      >
        {{ item.name }}
      </span>
    </template>

    <template v-slot:item.geode_object_type="{ item }">
      <v-chip size="x-small" variant="outlined" class="type-chip">
        {{ item.geode_object_type }}
      </v-chip>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span class="text-caption text-white-opacity-60">{{
        formatSmartDate(item.created_at)
      }}</span>
    </template>

    <template v-slot:item.visible="{ item }">
      <v-btn
        :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
        size="small"
        variant="text"
        color="white"
        @click.stop="$emit('toggle-visibility', item)"
      />
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="$emit('focus-camera', item)"
        >
          <v-icon>mdi-target</v-icon>
          <v-tooltip activator="parent" location="top"
            >Focus Camera</v-tooltip
          >
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="$emit('isolate', item)"
        >
          <v-icon>mdi-filter-variant</v-icon>
          <v-tooltip activator="parent" location="top">Isolate</v-tooltip>
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="$emit('rename', item)"
        >
          <v-icon>mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">Rename</v-tooltip>
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          color="error"
          @click.stop="$emit('delete', item)"
        >
          <v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">Delete</v-tooltip>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
  defineProps({
    items: {
      type: Array,
      required: true,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: "",
    },
  })

  defineEmits([
    "update:selectedIds",
    "toggle-visibility",
    "focus-camera",
    "isolate",
    "rename",
    "delete",
  ])

  const headers = [
    { title: "Name", key: "name", sortable: true },
    { title: "Type", key: "geode_object_type", sortable: true },
    { title: "Date", key: "created_at", sortable: true },
    { title: "Visibility", key: "visible", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "end" },
  ]

  function formatSmartDate(dateStr) {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    let relative = ""
    if (diff < 60) relative = "just now"
    else if (diff < 3600) relative = `${Math.floor(diff / 60)}m ago`
    else if (diff < 86400) relative = `${Math.floor(diff / 3600)}h ago`
    else relative = `${Math.floor(diff / 86400)}d ago`
    return `${relative} (${date.toLocaleDateString()})`
  }
</script>

<style scoped>
  .custom-table {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .custom-table :deep(thead) {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .custom-table :deep(thead tr th) {
    background: rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px);
  }

  .custom-table :deep(.v-table__wrapper) {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  .custom-table :deep(.v-table__wrapper::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }

  .custom-table :deep(.v-table__wrapper::-webkit-scrollbar-track) {
    background: transparent;
  }

  .custom-table :deep(.v-table__wrapper::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .custom-table :deep(.v-table__wrapper::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.5);
  }

  .type-chip {
    border-color: rgba(255, 255, 255, 0.3) !important;
    color: white !important;
    background: rgba(255, 255, 255, 0.05) !important;
    height: 20px !important;
    width: auto !important;
  }

  .text-white-opacity-60 {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .title-hover {
    transition: color 0.2s ease;
  }

  .title-hover:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }

  :deep(.v-data-table-header__content) {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: bold;
  }
</style>
