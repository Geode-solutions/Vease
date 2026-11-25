<script setup lang="ts">
import { MAX_ENTRIES, isFailure, useActivityStore } from "@ogw_front/stores/activity";
import { matchesSearch, sortSources } from "@vease/utils/activity_display";
import ActivityRow from "@vease/components/activity/ActivityRow.vue";
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
const activityStore = useActivityStore();
// The clock only ticks while a request runs: the history rows keep their own duration
const { now, pause, resume } = useNow({ interval: NOW_INTERVAL_MS, controls: true });

const hiddenSources = ref(new Set<string>());
const statusFilter = ref<StatusFilter>("all");
// Vuetify sets a cleared field to null
const search = ref<string | null>("");
const expandedIds = ref(new Set<number>());
// While paused, the history stops at the last entry seen: new lines wait instead of pushing the list down
const pausedAfterId = ref<number | undefined>(undefined);

const sources = computed(() => sortSources(activityStore.entries.map((entry) => entry.source)));

const visibleEntries = computed(() =>
  activityStore.entries.filter(
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
  return activityStore.entries.filter(
    (entry) => entry.id > pausedAfter && entry.status !== "running",
  ).length;
});

watch(
  () => activityStore.running.length > 0,
  (isRunning) => {
    if (isRunning) {
      resume();
    } else {
      pause();
    }
  },
  { immediate: true },
);

// The errors are seen as long as the activity panel is open
watch(
  () => activityStore.unseen_errors,
  () => {
    activityStore.mark_errors_seen();
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
    pausedAfterId.value = activityStore.entries.at(-1)?.id ?? 0;
  } else {
    pausedAfterId.value = undefined;
  }
}

function clear(): void {
  activityStore.clear();
  expandedIds.value = new Set();
}

function close(): void {
  UIStore.setShowActivityPiP(false);
}
</script>

<template>
  <ResizablePiP
    storage-key="activity-pip"
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
        <span class="text-subtitle-2 font-weight-bold">Activity</span>
        <span v-if="activityStore.running.length > 0" class="activity-live ml-3">
          <span class="activity-live__dot" />{{ activityStore.running.length }} running
        </span>
        <v-spacer />
        <v-btn
          icon
          size="x-small"
          :variant="pausedAfterId === undefined ? 'text' : 'tonal'"
          data-testid="activityPauseButton"
          @click="togglePause"
        >
          <v-icon size="16">{{ pausedAfterId === undefined ? "ph-pause" : "ph-play" }}</v-icon>
          <v-tooltip activator="parent" location="top">
            {{ pausedAfterId === undefined ? "Pause" : "Resume" }}
          </v-tooltip>
        </v-btn>
        <v-btn icon size="x-small" variant="text" data-testid="activityClearButton" @click="clear">
          <v-icon size="16">ph-trash</v-icon>
          <v-tooltip activator="parent" location="top">Clear</v-tooltip>
        </v-btn>
        <v-btn icon size="x-small" variant="text" data-testid="activityCloseButton" @click="close">
          <v-icon size="16">ph-x</v-icon>
          <v-tooltip activator="parent" location="top">Close</v-tooltip>
        </v-btn>
      </div>
    </template>

    <div class="activity d-flex flex-column fill-height overflow-hidden" data-testid="activity">
      <div class="activity-bar d-flex align-center flex-wrap ga-3 px-4 pb-3">
        <div class="d-flex align-center flex-wrap ga-1">
          <v-chip
            v-for="source in sources"
            :key="source"
            size="small"
            :variant="hiddenSources.has(source) ? 'outlined' : 'flat'"
            :color="hiddenSources.has(source) ? undefined : 'primary'"
            class="text-none"
            :data-testid="`activitySource-${source}`"
            @click="toggleSource(source)"
          >
            {{ source }}
          </v-chip>
        </div>
        <div class="activity-filters d-flex align-center ga-3">
          <div class="activity-status" role="radiogroup" aria-label="Status filter">
            <button
              v-for="option in STATUS_OPTIONS"
              :key="option.value"
              type="button"
              role="radio"
              class="activity-status__option"
              :class="{ 'activity-status__option--active': statusFilter === option.value }"
              :aria-checked="statusFilter === option.value"
              :data-testid="`activityStatus-${option.value}`"
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
            class="activity-search"
            data-testid="activitySearch"
          />
        </div>
      </div>

      <div class="activity-list flex-grow-1 overflow-y-auto">
        <template v-if="running.length > 0">
          <div class="activity-section">
            <v-icon size="12" class="mr-1">ph-circle-notch</v-icon>In progress
          </div>
          <ActivityRow
            v-for="entry in running"
            :key="entry.id"
            :entry="entry"
            :now="now.getTime()"
            :expanded="expandedIds.has(entry.id)"
            @toggle="toggleExpanded(entry.id)"
          />
        </template>

        <div v-if="history.length > 0" class="activity-section">
          <v-icon size="12" class="mr-1">ph-clock-counter-clockwise</v-icon>History
          <span v-if="waitingCount > 0" class="activity-waiting ml-2">
            paused · {{ waitingCount }} new
          </span>
        </div>
        <ActivityRow
          v-for="entry in history"
          :key="entry.id"
          :entry="entry"
          :expanded="expandedIds.has(entry.id)"
          @toggle="toggleExpanded(entry.id)"
        />

        <div
          v-if="running.length === 0 && history.length === 0"
          class="d-flex flex-column align-center justify-center text-center fill-height px-6"
          data-testid="activityEmpty"
        >
          <v-icon size="32" class="mb-2 text-medium-emphasis">ph-terminal-window</v-icon>
          <div class="text-caption text-medium-emphasis">
            Requests to the back and the viewer show up here as they run.
          </div>
        </div>
      </div>

      <div class="activity-foot d-flex align-center ga-4 px-4">
        <span> <b>{{ activityStore.entries.length }}</b> entries </span>
        <span>
          <b :class="{ 'text-error': activityStore.error_count > 0 }">{{
            activityStore.error_count
          }}</b>
          {{ activityStore.error_count === 1 ? "error" : "errors" }}
        </span>
        <v-spacer />
        <span>last {{ MAX_ENTRIES }} kept</span>
      </div>
    </div>
  </ResizablePiP>
</template>

<style scoped>
.activity {
  --activity-mono: ui-monospace, "JetBrains Mono", "Cascadia Mono", "DejaVu Sans Mono", monospace;
}

.pip-header {
  cursor: grab;
}

.pip-header:active {
  cursor: grabbing;
}

.activity-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 9px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(var(--v-theme-accent), 0.16);
}

.activity-live__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(var(--v-theme-accent));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-accent), 0.25);
}

.activity-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* On its own line once the panel is narrow, still aligned right */
.activity-filters {
  flex: 1 0 auto;
  justify-content: flex-end;
}

.activity-status {
  display: flex;
  height: 30px;
  flex-shrink: 0;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 8px;
  overflow: hidden;
}

.activity-status__option {
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

.activity-status__option + .activity-status__option {
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.25);
}

.activity-status__option:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.activity-status__option--active,
.activity-status__option--active:hover {
  background: rgba(var(--v-theme-on-surface), 0.12);
  font-weight: 700;
}

.activity-search {
  width: 180px;
  flex: 0 0 180px;
}

.activity-search :deep(.v-field) {
  font-size: 12px;
  --v-input-control-height: 30px;
}

.activity-search :deep(.v-field__input) {
  min-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.activity-section {
  display: flex;
  align-items: center;
  padding: 8px 16px 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.6;
}

.activity-waiting {
  text-transform: none;
  letter-spacing: 0;
  color: rgb(var(--v-theme-accent));
}

.activity-foot {
  height: 26px;
  min-height: 26px;
  font-size: 11px;
  opacity: 0.75;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
