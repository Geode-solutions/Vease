<script setup>
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = 3600
  const SECONDS_IN_DAY = 86400
  const MILLISECONDS_TO_SECONDS = 1000

  const { items, search, compact } = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
    compact: { type: Boolean, default: false },
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

  const headers = computed(() => [
    { title: "Name", key: "name", sortable: true, width: "auto" },
    {
      title: "Type",
      key: "geode_object_type",
      sortable: true,
      align: "center",
      width: compact ? "80px" : "100px",
    },
    {
      title: "Date",
      key: "created_at",
      sortable: true,
      align: "center",
      width: compact ? "110px" : "160px",
    },
    {
      title: "Visibility",
      key: "visible",
      sortable: false,
      align: "center",
      width: compact ? "70px" : "100px",
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
      align: "end",
      width: compact ? "140px" : "180px",
    },
  ])

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
    item-value="id"
    return-object
    class="transparent-table"
    hide-default-footer
    :items-per-page="-1"
  >
    <template #[`item.name`]="{ item }">
      <div
        class="d-flex align-center py-2 overflow-hidden"
        style="min-width: 0"
      >
        <v-icon size="20" class="mr-3 flex-shrink-0 opacity-60"
          >mdi-file-outline</v-icon
        >
        <span
          class="font-weight-medium cursor-pointer text-truncate pb-1"
          style="min-width: 0; flex: 1 1 auto"
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
        color="white"
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
  .transparent-table {
    background: transparent !important;
    color: white !important;
    border: none !important;
  }

  .transparent-table :deep(.v-table__wrapper) {
    background: transparent !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }

  .transparent-table :deep(table) {
    background: transparent !important;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
  }

  .transparent-table :deep(thead) {
    flex-shrink: 0 !important;
  }

  .transparent-table :deep(tbody) {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    min-height: 0 !important;
  }

  .transparent-table :deep(thead tr),
  .transparent-table :deep(tbody tr) {
    display: table !important;
    width: 100% !important;
    table-layout: fixed !important;
  }

  .transparent-table :deep(.v-data-table__th) {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 0.7rem !important;
    font-weight: 700 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
  }

  .transparent-table :deep(.v-data-table-header__content) {
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 0.7rem !important;
    font-weight: 700 !important;
    letter-spacing: 1.5px !important;
  }

  .transparent-table :deep(.v-data-table__tr) {
    background: transparent !important;
  }

  .transparent-table :deep(.v-data-table__tr:hover) {
    background: rgba(255, 255, 255, 0.02) !important;
  }

  .transparent-table :deep(.v-data-table__td) {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .transparent-table :deep(.v-data-table__th .v-icon) {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  .transparent-table :deep(.v-selection-control) {
    color: white !important;
  }

  .transparent-table :deep(.v-data-table-rows-no-data) {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.4) !important;
  }

  .transparent-table :deep(tbody) {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .transparent-table :deep(tbody::-webkit-scrollbar) {
    width: 6px;
  }

  .transparent-table :deep(tbody::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
</style>
