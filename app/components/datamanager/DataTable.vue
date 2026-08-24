<script setup>
import BatchActionBanner from "@vease/components/datamanager/BatchActionBanner.vue";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86_400;
const MILLISECONDS_TO_SECONDS = 1000;

const { items, search, compact } = defineProps({
  items: { type: Array, required: true },
  search: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});

const selectedIds = defineModel("selectedIds", {
  type: Array,
  default: () => [],
});

const emit = defineEmits([
  "toggle-visibility",
  "focus-camera",
  "isolate",
  "rename",
  "delete",
  "delete-selected",
  "toggle-visibility-selected",
]);

const headers = computed(() => [
  { title: "Name", key: "name", sortable: true, width: "auto" },
  {
    title: "Type",
    key: "geode_object_type",
    sortable: true,
    align: "center",
    width: compact ? "90px" : "110px",
  },
  {
    title: "Date",
    key: "created_at",
    sortable: true,
    align: "center",
    width: compact ? "120px" : "160px",
  },
  {
    title: "Visibility",
    key: "visible",
    sortable: false,
    align: "center",
    width: compact ? "90px" : "140px",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "end",
    width: compact ? "140px" : "180px",
  },
]);

const isAllVisible = computed(() => {
  if (items.length === 0) {
    return false;
  }
  const targetItems = selectedIds.value.length > 0 ? selectedIds.value : items;
  return targetItems.every((item) => item.visible);
});

function getRowProps({ item }) {
  const isSelected = selectedIds.value.some((selected) => selected.id === item.id);
  return {
    class: isSelected ? "selected-row" : "",
  };
}

function formatSmartDate(dateStr) {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date) / MILLISECONDS_TO_SECONDS);

  let relative = "";
  if (diff < SECONDS_IN_MINUTE) {
    relative = "just now";
  } else if (diff < SECONDS_IN_HOUR) {
    relative = `${Math.floor(diff / SECONDS_IN_MINUTE)}m ago`;
  } else if (diff < SECONDS_IN_DAY) {
    relative = `${Math.floor(diff / SECONDS_IN_HOUR)}h ago`;
  } else {
    relative = `${Math.floor(diff / SECONDS_IN_DAY)}d ago`;
  }

  return `${relative} (${date.toLocaleDateString()})`;
}
</script>

<template>
  <div class="d-flex flex-column fill-height overflow-hidden" style="min-height: 0">
    <BatchActionBanner
      :selected-ids="selectedIds"
      @delete="emit('delete-selected')"
      @toggle-visibility-selected="emit('toggle-visibility-selected')"
      @clear="selectedIds = []"
    />

    <v-data-table
      v-model="selectedIds"
      :headers="headers"
      :items="items"
      :search="search"
      show-select
      item-value="id"
      return-object
      class="transparent-table flex-grow-1 overflow-hidden"
      hide-default-footer
      :items-per-page="-1"
      :row-props="getRowProps"
    >
      <!-- Header slot for Visibility column -->
      <template #[`header.visible`]>
        <div class="d-flex align-center justify-center ga-1">
          <span>VISIBILITY</span>
          <v-btn
            icon
            size="x-small"
            variant="text"
            color="white"
            class="opacity-70 hover-opacity-100 ml-1"
            data-testid="toggleVisibilityHeaderButton"
            @click.stop="emit('toggle-visibility-selected')"
          >
            <v-icon size="16">{{ isAllVisible ? "mdi-eye" : "mdi-eye-off" }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{
                selectedIds.length > 0
                  ? `Toggle visibility for ${selectedIds.length} selected item(s)`
                  : "Toggle visibility for all items"
              }}
            </v-tooltip>
          </v-btn>
        </div>
      </template>

      <!-- Header slot for Actions column (TRASH BUTTON ON SELECT ALL HEADER LINE) -->
      <template #[`header.actions`]>
        <div class="d-flex align-center justify-end ga-1">
          <span class="mr-1">ACTIONS</span>
          <v-btn
            icon
            size="small"
            variant="text"
            :color="selectedIds.length > 0 ? 'error' : 'grey-lighten-1'"
            :disabled="selectedIds.length === 0"
            data-testid="deleteAllSelectedButton"
            @click.stop="emit('delete-selected')"
          >
            <v-icon size="18">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">
              {{
                selectedIds.length > 0
                  ? `Delete ${selectedIds.length} selected item(s)`
                  : "Delete selected items (select items first)"
              }}
            </v-tooltip>
          </v-btn>
        </div>
      </template>

      <!-- Item row slots -->
      <template #[`item.name`]="{ item }">
        <div
          class="d-flex align-center py-2 overflow-hidden"
          style="min-width: 0"
          @dblclick="emit('rename', item)"
        >
          <v-icon size="20" class="mr-3 flex-shrink-0 opacity-60">mdi-file-outline</v-icon>
          <span
            class="font-weight-medium cursor-pointer text-truncate pb-1"
            style="min-width: 0; flex: 1 1 auto"
            data-testid="itemName"
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
          data-testid="dataVisibilityButton"
          @click.stop="emit('toggle-visibility', item)"
        >
          <v-icon size="20">{{ item.visible ? "mdi-eye" : "mdi-eye-off" }}</v-icon>
          <v-tooltip activator="parent" location="top">{{
            item.visible ? "Hide item" : "Show item"
          }}</v-tooltip>
        </v-btn>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-1 justify-end">
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            data-testid="focusDataButton"
            @click.stop="emit('focus-camera', item)"
          >
            <v-icon size="18">mdi-target</v-icon>
            <v-tooltip activator="parent" location="top">Focus camera</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            data-testid="isolateDataButton"
            @click.stop="emit('isolate', item)"
          >
            <v-icon size="18">mdi-filter-variant</v-icon>
            <v-tooltip activator="parent" location="top">Isolate item</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            data-testid="renameDataButton"
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
            data-testid="deleteDataButton"
            @click.stop="emit('delete', item)"
          >
            <v-icon size="18">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Delete item</v-tooltip>
          </v-btn>
        </div>
      </template>

      <!-- Empty state when no data exists -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center py-12 text-grey-lighten-1">
          <v-icon size="48" class="mb-3 opacity-40">mdi-database-off-outline</v-icon>
          <span class="text-body-1 font-weight-medium mb-1">No data available</span>
          <span class="text-caption opacity-60">Import data files or models to view them here</span>
        </div>
      </template>
    </v-data-table>
  </div>
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

.transparent-table :deep(.v-data-table__tr.selected-row) {
  background: rgba(255, 255, 255, 0.08) !important;
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
