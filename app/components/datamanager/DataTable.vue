<script setup>
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = 3600
  const SECONDS_IN_DAY = 86400
  const MILLISECONDS_TO_SECONDS = 1000

  const { items, search } = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
  })

  const selectedIds = defineModel("selectedIds", {
    type: Array,
    default: () => [],
  })

  const emit = defineEmits([
    "toggle-visibility",
    "focus-camera",
    "isolate",
    "rename",
    "delete",
  ])

  const headers = [
    { title: "Name", key: "name", sortable: true },
    {
      title: "Type",
      key: "geode_object_type",
      sortable: true,
      align: "center",
    },
    { title: "Date", key: "created_at", sortable: true, align: "center" },
    { title: "Visibility", key: "visible", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "end" },
  ]

  function formatSmartDate(dateStr) {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const diff = Math.floor((Date.now() - date) / MILLISECONDS_TO_SECONDS)

    let relative = ""
    if (diff < SECONDS_IN_MINUTE) {
      relative = "just now"
    } else if (diff < SECONDS_IN_HOUR) {
      relative = `${Math.floor(diff / SECONDS_IN_MINUTE)}m ago`
    } else if (diff < SECONDS_IN_DAY) {
      relative = `${Math.floor(diff / SECONDS_IN_HOUR)}h ago`
    } else {
      relative = `${Math.floor(diff / SECONDS_IN_DAY)}d ago`
    }

    return `${relative} (${date.toLocaleDateString()})`
  }
</script>

<template>
  <v-data-table
    v-model="selectedIds"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    fixed-header
    :height="selectedIds.length > 0 ? '550' : '620'"
    item-value="id"
    return-object
    class="bg-transparent text-white custom-scrollbar border-0"
    hide-default-footer
    :items-per-page="-1"
  >
    <template #[`item.name`]="{ item }">
      <div class="d-flex align-center py-2">
        <v-icon size="20" class="mr-3 opacity-60">mdi-file-outline</v-icon>
        <span
          class="font-weight-medium cursor-pointer text-no-wrap"
          @click="emit('rename', item)"
        >
          {{ item.name }}
        </span>
      </div>
    </template>

    <template #[`item.geode_object_type`]="{ item }">
      <v-chip
        size="x-small"
        color="white"
        variant="outlined"
        class="text-none border-opacity-20 font-weight-bold"
      >
        {{ item.geode_object_type }}
      </v-chip>
    </template>

    <template #[`item.created_at`]="{ item }">
      <span class="text-caption text-grey-lighten-2 font-weight-light">{{
        formatSmartDate(item.created_at)
      }}</span>
    </template>

    <template #[`item.visible`]="{ item }">
      <v-btn
        icon
        size="small"
        variant="text"
        :color="item.visible ? 'primary' : 'white'"
        class="opacity-80"
        @click.stop="emit('toggle-visibility', item)"
      >
        <v-icon size="20">{{
          item.visible ? "mdi-eye" : "mdi-eye-off"
        }}</v-icon>
      </v-btn>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="emit('focus-camera', item)"
        >
          <v-icon size="18">mdi-target</v-icon>
          <v-tooltip activator="parent" location="top">Focus</v-tooltip>
        </v-btn>

        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="emit('isolate', item)"
        >
          <v-icon size="18">mdi-filter-variant</v-icon>
          <v-tooltip activator="parent" location="top">Isolate</v-tooltip>
        </v-btn>

        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="emit('rename', item)"
        >
          <v-icon size="18">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">Rename</v-tooltip>
        </v-btn>

        <v-btn
          icon
          size="small"
          variant="text"
          color="error"
          @click.stop="emit('delete', item)"
        >
          <v-icon size="18">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">Delete</v-tooltip>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped>
  :deep(.v-data-table-header__content) {
    font-size: 0.7rem !important;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }

  :deep(.v-data-table__th) {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }

  :deep(.v-data-table__td) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  :deep(.v-data-table__tr:hover) {
    background: rgba(255, 255, 255, 0.02) !important;
  }

  .custom-scrollbar :deep(.v-table__wrapper) {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .custom-scrollbar :deep(.v-table__wrapper::-webkit-scrollbar) {
    width: 6px;
  }

  .custom-scrollbar :deep(.v-table__wrapper::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
</style>
