<template>
  <v-data-table :model-value="selectedIds" @update:model-value="$emit('update:selectedIds', $event)" :headers="headers"
    :items="items" :search="search" show-select fixed-header height="550" item-value="id" return-object
    class="bg-transparent border-thin rounded-lg text-white custom-scrollbar">
    <template v-slot:item.name="{ item }">
      <span class="font-weight-medium cursor-pointer text-no-wrap" @click="$emit('rename', item)">
        {{ item.name }}
      </span>
    </template>

    <template v-slot:item.geode_object_type="{ item }">
      <v-chip size="x-small" variant="outlined" class="text-caption border-opacity-25 px-2">
        {{ item.geode_object_type }}
      </v-chip>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span class="text-caption text-grey-lighten-1">
        {{ formatSmartDate(item.created_at) }}
      </span>
    </template>

    <template v-slot:item.visible="{ item }">
      <v-btn icon size="small" variant="text" color="white" @click.stop="$emit('toggle-visibility', item)">
        <v-icon size="20">{{ item.visible ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn icon size="small" variant="text" color="white" @click.stop="$emit('focus-camera', item)">
          <v-icon size="18">mdi-target</v-icon>
          <v-tooltip activator="parent" location="top">Focus</v-tooltip>
        </v-btn>

        <v-btn icon size="small" variant="text" color="white" @click.stop="$emit('isolate', item)">
          <v-icon size="18">mdi-filter-variant</v-icon>
          <v-tooltip activator="parent" location="top">Isolate</v-tooltip>
        </v-btn>

        <v-btn icon size="small" variant="text" color="white" @click.stop="$emit('rename', item)">
          <v-icon size="18">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">Rename</v-tooltip>
        </v-btn>

        <v-btn icon size="small" variant="text" color="error" @click.stop="$emit('delete', item)">
          <v-icon size="18">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">Delete</v-tooltip>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  selectedIds: { type: Array, default: () => [] },
  search: { type: String, default: "" },
})

defineEmits(["update:selectedIds", "toggle-visibility", "focus-camera", "isolate", "rename", "delete"])

const headers = [
  { title: "Name", key: "name", sortable: true },
  { title: "Type", key: "geode_object_type", sortable: true, align: 'center' },
  { title: "Date", key: "created_at", sortable: true, align: 'center' },
  { title: "Visibility", key: "visible", sortable: false, align: "center" },
  { title: "Actions", key: "actions", sortable: false, align: "end" },
]

const formatSmartDate = (dateStr) => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const diff = Math.floor((new Date() - date) / 1000)
  const relative = diff < 60 ? "just now" : diff < 3600 ? `${Math.floor(diff / 60)}m ago` : diff < 86400 ? `${Math.floor(diff / 3600)}h ago` : `${Math.floor(diff / 86400)}d ago`
  return `${relative} (${date.toLocaleDateString()})`
}
</script>

<style scoped>
:deep(.v-data-table-header__content) {
  font-size: 0.65rem !important;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

:deep(.v-data-table__th) {
  background: transparent !important;
  backdrop-filter: blur(10px);
}

.custom-scrollbar :deep(.v-table__wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar :deep(.v-table__wrapper::-webkit-scrollbar) {
  width: 8px;
}

.custom-scrollbar :deep(.v-table__wrapper::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>
