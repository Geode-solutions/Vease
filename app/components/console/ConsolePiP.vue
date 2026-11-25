<script setup lang="ts">
import { MAX_ENTRIES, isFailure, useConsoleStore } from "@ogw_front/stores/console";
import { matchesSearch, sortSources } from "@vease/utils/console_display";
import ConsoleRow from "@vease/components/console/ConsoleRow.vue";
import ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useNow } from "@vueuse/core";
import { useUIStore } from "@vease/stores/ui";

type StatusFilter = "all" | "running" | "errors";

const NOW_INTERVAL_MS = 100;
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "errors", label: "Errors" },
];

const UIStore = useUIStore();
const consoleStore = useConsoleStore();
const now = useNow({ interval: NOW_INTERVAL_MS });

const hiddenSources = ref(new Set<string>());
const statusFilter = ref<StatusFilter>("all");
// Vuetify sets a cleared field to null
const search = ref<string | null>("");
const expandedIds = ref(new Set<number>());
// While paused, the history stops at the last entry seen: new lines wait instead of pushing the list down
const pausedAfterId = ref<number | undefined>(undefined);

const sources = computed(() => sortSources(consoleStore.entries.map((entry) => entry.source)));

const visibleEntries = computed(() =>
  consoleStore.entries.filter(
    (entry) => !hiddenSources.value.has(entry.source) && matchesSearch(entry, search.value ?? ""),
  ),
);
const running = computed(() => {
  if (statusFilter.value === "errors") {
    return [];
  }
  return visibleEntries.value.filter((entry) => entry.status === "running");
});
const history = computed(() => {
  if (statusFilter.value === "running") {
    return [];
  }
  return visibleEntries.value
    .filter(
      (entry) =>
        entry.status !== "running" &&
        (statusFilter.value === "all" || isFailure(entry.status)) &&
        (pausedAfterId.value === undefined || entry.id <= pausedAfterId.value),
    )
    .toReversed();
});
const waitingCount = computed(() => {
  const pausedAfter = pausedAfterId.value;
  if (pausedAfter === undefined) {
    return 0;
  }
  return consoleStore.entries.filter(
    (entry) => entry.id > pausedAfter && entry.status !== "running",
  ).length;
});

// The errors are seen as long as the console is open
watch(
  () => consoleStore.unseen_errors,
  () => {
    consoleStore.mark_errors_seen();
  },
  { immediate: true },
);

function toggleSource(source: string): void {
  const next = new Set(hiddenSources.value);
  if (next.has(source)) {
    next.delete(source);
  } else {
    next.add(source);
  }
  hiddenSources.value = next;
}

function toggleExpanded(entryId: number): void {
  const next = new Set(expandedIds.value);
  if (next.has(entryId)) {
    next.delete(entryId);
  } else {
    next.add(entryId);
  }
  expandedIds.value = next;
}

function togglePause(): void {
  if (pausedAfterId.value === undefined) {
    pausedAfterId.value = consoleStore.entries.at(-1)?.id ?? 0;
  } else {
    pausedAfterId.value = undefined;
  }
}

function clear(): void {
  consoleStore.clear();
  expandedIds.value = new Set();
}

function close(): void {
  UIStore.setShowConsolePiP(false);
}
</script>

<template>
  <ResizablePiP
    storage-key="console-pip"
    :escapeFunction="close"
    :default-width="680"
    :default-height="460"
    :min-width="520"
    :min-height="260"
  >
    <template #handle>
      <div
        class="pip-header d-flex align-center px-4"
        style="height: 40px; min-height: 40px; user-select: none"
      >
        <v-icon size="18" color="primary" class="mr-2">ph-terminal-window</v-icon>
        <span class="text-subtitle-2 font-weight-bold">Console</span>
        <span v-if="consoleStore.running.length > 0" class="console-live ml-3">
          <span class="console-live__dot" />{{ consoleStore.running.length }} running
        </span>
        <v-spacer />
        <v-btn
          icon
          size="x-small"
          :variant="pausedAfterId === undefined ? 'text' : 'tonal'"
          data-testid="consolePauseButton"
          @click="togglePause"
        >
          <v-icon size="16">{{ pausedAfterId === undefined ? "ph-pause" : "ph-play" }}</v-icon>
          <v-tooltip activator="parent" location="top">
            {{ pausedAfterId === undefined ? "Pause" : "Resume" }}
          </v-tooltip>
        </v-btn>
        <v-btn icon size="x-small" variant="text" data-testid="consoleClearButton" @click="clear">
          <v-icon size="16">ph-trash</v-icon>
          <v-tooltip activator="parent" location="top">Clear</v-tooltip>
        </v-btn>
        <v-btn icon size="x-small" variant="text" data-testid="consoleCloseButton" @click="close">
          <v-icon size="16">ph-x</v-icon>
          <v-tooltip activator="parent" location="top">Close</v-tooltip>
        </v-btn>
      </div>
    </template>

    <div class="console d-flex flex-column fill-height overflow-hidden" data-testid="console">
      <div class="console-bar d-flex align-center flex-wrap ga-3 px-4 pb-3">
        <div class="d-flex align-center flex-wrap ga-1">
          <v-chip
            v-for="source in sources"
            :key="source"
            size="small"
            :variant="hiddenSources.has(source) ? 'outlined' : 'flat'"
            :color="hiddenSources.has(source) ? undefined : 'primary'"
            class="text-none"
            :data-testid="`consoleSource-${source}`"
            @click="toggleSource(source)"
          >
            {{ source }}
          </v-chip>
        </div>
        <div class="console-filters d-flex align-center ga-3">
          <div class="console-status" role="radiogroup" aria-label="Status filter">
            <button
              v-for="option in STATUS_OPTIONS"
              :key="option.value"
              type="button"
              role="radio"
              class="console-status__option"
              :class="{ 'console-status__option--active': statusFilter === option.value }"
              :aria-checked="statusFilter === option.value"
              :data-testid="`consoleStatus-${option.value}`"
              @click="statusFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <v-text-field
            v-model="search"
            placeholder="Filter…"
            prepend-inner-icon="ph-magnifying-glass"
            density="compact"
            variant="outlined"
            rounded="pill"
            hide-details
            clearable
            class="console-search"
            data-testid="consoleSearch"
          />
        </div>
      </div>

      <div class="console-list flex-grow-1 overflow-y-auto">
        <template v-if="running.length > 0">
          <div class="console-section">
            <v-icon size="12" class="mr-1">ph-circle-notch</v-icon>In progress
          </div>
          <ConsoleRow
            v-for="entry in running"
            :key="entry.id"
            :entry="entry"
            :now="now.getTime()"
            :expanded="expandedIds.has(entry.id)"
            @toggle="toggleExpanded(entry.id)"
          />
        </template>

        <div v-if="history.length > 0" class="console-section">
          <v-icon size="12" class="mr-1">ph-clock-counter-clockwise</v-icon>History
          <span v-if="waitingCount > 0" class="console-waiting ml-2">
            paused · {{ waitingCount }} new
          </span>
        </div>
        <ConsoleRow
          v-for="entry in history"
          :key="entry.id"
          :entry="entry"
          :now="now.getTime()"
          :expanded="expandedIds.has(entry.id)"
          @toggle="toggleExpanded(entry.id)"
        />

        <div
          v-if="running.length === 0 && history.length === 0"
          class="d-flex flex-column align-center justify-center text-center fill-height px-6"
          data-testid="consoleEmpty"
        >
          <v-icon size="32" class="mb-2 text-medium-emphasis">ph-terminal-window</v-icon>
          <div class="text-caption text-medium-emphasis">
            Requests to the back and the viewer show up here as they run.
          </div>
        </div>
      </div>

      <div class="console-foot d-flex align-center ga-4 px-4">
        <span> <b>{{ consoleStore.entries.length }}</b> entries </span>
        <span>
          <b :class="{ 'text-error': consoleStore.error_count > 0 }">{{
            consoleStore.error_count
          }}</b>
          {{ consoleStore.error_count === 1 ? "error" : "errors" }}
        </span>
        <v-spacer />
        <span>last {{ MAX_ENTRIES }} kept</span>
      </div>
    </div>
  </ResizablePiP>
</template>

<style scoped>
.console {
  --console-mono: ui-monospace, "JetBrains Mono", "Cascadia Mono", "DejaVu Sans Mono", monospace;
}

.pip-header {
  cursor: grab;
}

.pip-header:active {
  cursor: grabbing;
}

.console-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 9px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(var(--v-theme-accent), 0.16);
}

.console-live__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(var(--v-theme-accent));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-accent), 0.25);
}

.console-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* On its own line once the panel is narrow, still aligned right */
.console-filters {
  flex: 1 0 auto;
  justify-content: flex-end;
}

.console-status {
  display: flex;
  height: 30px;
  flex-shrink: 0;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 8px;
  overflow: hidden;
}

.console-status__option {
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  padding: 0 14px;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface));
  transition: background-color 0.15s ease;
}

.console-status__option + .console-status__option {
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.25);
}

.console-status__option:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.console-status__option--active,
.console-status__option--active:hover {
  background: rgba(var(--v-theme-on-surface), 0.12);
  font-weight: 700;
}

.console-search {
  width: 180px;
  flex: 0 0 180px;
}

.console-search :deep(.v-field) {
  font-size: 12px;
  --v-input-control-height: 30px;
}

.console-search :deep(.v-field__input) {
  min-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.console-section {
  display: flex;
  align-items: center;
  padding: 8px 16px 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.6;
}

.console-waiting {
  text-transform: none;
  letter-spacing: 0;
  color: rgb(var(--v-theme-accent));
}

.console-foot {
  height: 26px;
  min-height: 26px;
  font-size: 11px;
  opacity: 0.75;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
