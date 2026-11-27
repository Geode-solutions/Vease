<script setup lang="ts">
import { formatCrs, formatCrsCode } from "@ogw_front/utils/crs";
import BatchActionBanner from "@vease/components/datamanager/BatchActionBanner.vue";
import type { CreationDate } from "@ogw_front/types/data";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { DataItem } from "@ogw_front/stores/data";
import type { SearchQuery } from "@ogw_front/types/ui";
import { middleTruncate } from "@ogw_front/utils/string";

interface Props {
  items: DataItem[];
  search: SearchQuery;
  compact: boolean;
}

interface Emits {
  "toggle-visibility": [item: DataItem];
  "focus-camera": [item: DataItem];
  isolate: [item: DataItem];
  rename: [item: DataItem];
  crs: [id: DataId];
  delete: [item: DataItem];
  "delete-selected": [];
  "toggle-visibility-selected": [];
}

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86_400;
// Older data show their date: "40d ago" says less than the date itself
const RELATIVE_DATE_MAX_DAYS = 7;
const MILLISECONDS_TO_SECONDS = 1000;
const CRS_MAX_LENGTH = 28;
const CRS_START_CHARS = 14;
const CRS_END_CHARS = 10;

const { items, search, compact } = defineProps<Props>();

const selectedIds = defineModel<DataItem[]>("selectedIds", { default: () => [] });

const emit = defineEmits<Emits>();

const DATE_COLUMN = [
  {
    title: "Date",
    key: "created_at",
    sortable: true,
    align: "center",
    width: "120px",
  } as const,
];
// Icon buttons only: the default cell padding would push the last one out of the column
const ICON_CELL = { class: "icon-cell" };

const headers = computed(
  () =>
    [
      { title: "Name", key: "name", sortable: true, width: "auto" },
      {
        title: "Type",
        key: "geode_object_type",
        sortable: true,
        align: "center",
        // The common type chips (TriangulatedSurface3D) fit; the name keeps the rest of the row
        width: compact ? "90px" : "180px",
      },
      {
        title: "CRS",
        key: "crs",
        sortable: false,
        align: "center",
        width: compact ? "100px" : "180px",
      },
      // The picture-in-picture view is narrow: the CRS column takes the date's room
      ...(compact ? [] : DATE_COLUMN),
      {
        title: "Visibility",
        key: "visible",
        sortable: false,
        align: "center",
        // The picture-in-picture view only shows the eye in the header
        width: compact ? "56px" : "140px",
        cellProps: ICON_CELL,
        headerProps: ICON_CELL,
      },
      {
        title: "Actions",
        key: "actions",
        sortable: false,
        align: "end",
        // Four 32px buttons and their gaps
        width: "150px",
        cellProps: ICON_CELL,
        headerProps: ICON_CELL,
      },
    ] as const,
);

const isAllVisible = computed(() => {
  if (items.length === 0) {
    return false;
  }
  const targetItems = selectedIds.value.length > 0 ? selectedIds.value : items;
  return targetItems.every((item) => item.visible);
});

function getRowProps({ item }: { item: DataItem }): { class: string } {
  const isSelected = selectedIds.value.some((selected) => selected.data_id === item.data_id);
  return {
    class: isSelected ? "selected-row" : "",
  };
}

// Short enough for the column: the full date and time are in the tooltip
function formatSmartDate(dateStr: CreationDate | undefined): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / MILLISECONDS_TO_SECONDS);

  if (diff < SECONDS_IN_MINUTE) {
    return "just now";
  }
  if (diff < SECONDS_IN_HOUR) {
    return `${Math.floor(diff / SECONDS_IN_MINUTE)}m ago`;
  }
  if (diff < SECONDS_IN_DAY) {
    return `${Math.floor(diff / SECONDS_IN_HOUR)}h ago`;
  }
  if (diff < RELATIVE_DATE_MAX_DAYS * SECONDS_IN_DAY) {
    return `${Math.floor(diff / SECONDS_IN_DAY)}d ago`;
  }
  return date.toLocaleDateString();
}

function formatFullDate(dateStr: CreationDate | undefined): string {
  if (!dateStr) {
    return "";
  }
  return new Date(dateStr).toLocaleString();
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
      item-value="data_id"
      return-object
      class="transparent-table flex-grow-1 overflow-hidden"
      hide-default-footer
      :items-per-page="-1"
      :row-props="getRowProps"
    >
      <!-- Header slot for Visibility column -->
      <template #[`header.visible`]>
        <div class="d-flex align-center justify-center ga-1">
          <span v-if="!compact">VISIBILITY</span>
          <v-btn
            icon
            size="x-small"
            variant="text"
            class="opacity-70 hover-opacity-100"
            :class="{ 'ml-1': !compact }"
            data-testid="toggleVisibilityHeaderButton"
            @click.stop="emit('toggle-visibility-selected')"
          >
            <v-icon size="16">{{ isAllVisible ? "ph-fill ph-eye" : "ph-eye-slash" }}</v-icon>
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
            :color="selectedIds.length > 0 ? 'error' : undefined"
            :disabled="selectedIds.length === 0"
            data-testid="deleteAllSelectedButton"
            @click.stop="emit('delete-selected')"
          >
            <v-icon size="18">ph-trash</v-icon>
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
          <v-icon size="20" class="mr-3 flex-shrink-0 opacity-60">ph-file</v-icon>
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

      <template #[`item.crs`]="{ item }">
        <v-btn
          variant="text"
          size="small"
          class="crs-button text-none text-caption font-weight-regular px-1"
          data-testid="crsCell"
          @click.stop="emit('crs', item.data_id)"
        >
          <!-- The picture-in-picture view is narrow: the code alone, the full name is in the tooltip -->
          <span class="text-truncate">{{
            compact
              ? formatCrsCode(item.crs)
              : middleTruncate(formatCrs(item.crs), CRS_MAX_LENGTH, CRS_START_CHARS, CRS_END_CHARS)
          }}</span>
          <v-tooltip activator="parent" location="top">{{ formatCrs(item.crs) }}</v-tooltip>
        </v-btn>
      </template>

      <template #[`item.geode_object_type`]="{ item }">
        <v-chip
          size="x-small"
          color="primary"
          variant="outlined"
          class="type-chip text-none font-weight-bold"
        >
          {{ item.geode_object_type }}
          <v-tooltip v-if="compact" activator="parent" location="top">{{
            item.geode_object_type
          }}</v-tooltip>
        </v-chip>
      </template>

      <template #[`item.created_at`]="{ item }">
        <span class="text-caption text-medium-emphasis" data-testid="dateCell">
          {{ formatSmartDate(item.created_at) }}
          <v-tooltip v-if="item.created_at" activator="parent" location="top">{{
            formatFullDate(item.created_at)
          }}</v-tooltip>
        </span>
      </template>

      <template #[`item.visible`]="{ item }">
        <v-btn
          icon
          size="small"
          variant="text"
          data-testid="dataVisibilityButton"
          @click.stop="emit('toggle-visibility', item)"
        >
          <v-icon size="20">{{ item.visible ? "ph-fill ph-eye" : "ph-eye-slash" }}</v-icon>
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
            density="comfortable"
            variant="text"
            data-testid="focusDataButton"
            @click.stop="emit('focus-camera', item)"
          >
            <v-icon size="18">ph-target</v-icon>
            <v-tooltip activator="parent" location="top">Focus camera</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            density="comfortable"
            variant="text"
            data-testid="isolateDataButton"
            @click.stop="emit('isolate', item)"
          >
            <v-icon size="18">ph-funnel-simple</v-icon>
            <v-tooltip activator="parent" location="top">Isolate item</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            density="comfortable"
            variant="text"
            data-testid="renameDataButton"
            @click.stop="emit('rename', item)"
          >
            <v-icon size="18">ph-pencil-simple</v-icon>
            <v-tooltip activator="parent" location="top">Rename</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            density="comfortable"
            variant="text"
            color="error"
            data-testid="deleteDataButton"
            @click.stop="emit('delete', item)"
          >
            <v-icon size="18">ph-trash</v-icon>
            <v-tooltip activator="parent" location="top">Delete item</v-tooltip>
          </v-btn>
        </div>
      </template>

      <!-- Empty state when no data exists -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
          <v-icon size="48" class="mb-3 opacity-40">ph-database</v-icon>
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
  color: rgb(var(--v-theme-on-surface)) !important;
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
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
}

.transparent-table :deep(.v-data-table-header__content) {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
}

.transparent-table :deep(.v-data-table__tr) {
  background: transparent !important;
}

.transparent-table :deep(.v-data-table__tr:hover) {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.transparent-table :deep(.v-data-table__tr.selected-row) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
}

.transparent-table :deep(.v-data-table__td) {
  background: transparent !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* A long type is cut with an ellipsis in the narrow picture-in-picture view */
.type-chip {
  max-width: 100%;
}

.type-chip :deep(.v-chip__content) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* A long CRS name is cut with an ellipsis instead of overflowing both sides of the cell */
.crs-button {
  max-width: 100%;
}

.crs-button :deep(.v-btn__content) {
  min-width: 0;
}

.transparent-table :deep(.icon-cell) {
  padding: 0 4px !important;
}

.transparent-table :deep(.v-data-table__th .v-icon) {
  color: rgba(var(--v-theme-on-surface), 0.4) !important;
}

.transparent-table :deep(.v-selection-control) {
  color: rgb(var(--v-theme-primary)) !important;
}

.transparent-table :deep(.v-data-table-rows-no-data) {
  background: transparent !important;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.transparent-table :deep(tbody) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-on-surface), 0.2) transparent;
}

.transparent-table :deep(tbody::-webkit-scrollbar) {
  width: 6px;
}

.transparent-table :deep(tbody::-webkit-scrollbar-thumb) {
  background: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 10px;
}
</style>
