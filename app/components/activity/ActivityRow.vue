<script setup lang="ts">
import { type ActivityEntry, isFailure } from "@ogw_front/stores/activity";

import {
  KNOWN_SOURCES,
  formatDuration,
  formatTime,
  isSlow,
  routeParts,
} from "@vease/utils/activity_display";
import type { Timestamp } from "@ogw_front/types/time";

interface Props {
  entry: ActivityEntry;
  now?: Timestamp;
  expanded: boolean;
}

interface Emits {
  toggle: [];
}

// `now` ticks only for the running rows: a finished row shows its own duration
const { entry, now = 0, expanded } = defineProps<Props>();
const emit = defineEmits<Emits>();

const STATUS_ICONS: Record<ActivityEntry["status"], string> = {
  running: "ph-circle-notch",
  success: "ph-check",
  error: "ph-x",
  timeout: "ph-x",
  info: "",
};

const parts = computed(() => routeParts(entry.route));
const failed = computed(() => isFailure(entry.status));
const sourceClass = computed(() =>
  KNOWN_SOURCES.includes(entry.source) ? `src--${entry.source}` : "src--ext",
);
const statusIcon = computed(() => {
  if (entry.kind === "event") {
    return "ph-arrow-down";
  }
  return STATUS_ICONS[entry.status];
});
const elapsed = computed(() => entry.duration_ms ?? now - entry.started_at);
const durationText = computed(() => {
  if (entry.status === "timeout") {
    return "timeout";
  }
  if (entry.kind === "event" || entry.kind === "connection") {
    return "";
  }
  return formatDuration(elapsed.value);
});
const hasDetail = computed(() => entry.params !== undefined || entry.error !== undefined);

function toggle(): void {
  if (hasDetail.value) {
    emit("toggle");
  }
}
</script>

<template>
  <div
    class="activity-row"
    :class="{
      'activity-row--failed': failed,
      'activity-row--open': expanded,
      'activity-row--clickable': hasDetail,
    }"
    data-testid="activityRow"
    :data-entry-id="entry.id"
    @click="toggle"
  >
    <span class="activity-row__time">{{ formatTime(entry.started_at) }}</span>
    <span class="activity-row__source" :class="sourceClass">{{ entry.source }}</span>
    <span class="activity-row__route">
      <template v-if="entry.kind === 'connection'">
        <v-icon size="13" :icon="failed ? 'ph-plugs' : 'ph-plugs-connected'" class="mr-1" />{{
          entry.route
        }}
      </template>
      <template v-else>
        <span class="text-medium-emphasis">{{ parts.scope }}</span>{{ parts.name }}
        <span v-if="entry.label" class="text-medium-emphasis"> · {{ entry.label }}</span>
      </template>
    </span>
    <span
      class="activity-row__status"
      :class="`status--${entry.kind === 'event' ? 'event' : entry.status}`"
    >
      <v-icon v-if="statusIcon" size="14" :icon="statusIcon" />
    </span>
    <span
      class="activity-row__duration"
      :class="{
        'duration--failed': failed,
        'duration--slow': !failed && isSlow(elapsed),
      }"
    >
      {{ durationText }}
    </span>
  </div>
  <div v-if="expanded" class="activity-detail" :class="{ 'activity-detail--failed': failed }">
    <div v-if="entry.params">
      <span class="activity-detail__key">params</span>{{ entry.params }}
    </div>
    <div v-if="entry.error">
      <span class="activity-detail__key">error</span>
      <span class="text-error">{{ entry.error }}</span>
    </div>
  </div>
</template>

<style scoped>
.activity-row {
  display: grid;
  grid-template-columns: 92px 64px minmax(0, 1fr) 20px 64px;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  padding: 0 16px;
  font-family: var(--activity-mono);
  font-size: 12px;
}

.activity-row--clickable {
  cursor: pointer;
}

.activity-row:hover,
.activity-row--open {
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.activity-row--failed {
  background: rgba(var(--v-theme-error), 0.08);
}

.activity-row__time {
  font-size: 11px;
  opacity: 0.6;
}

.activity-row__source {
  font-family: var(--v-font-body);
  font-size: 10.5px;
  font-weight: 600;
  text-align: center;
  border-radius: 4px;
  padding: 1px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.src--back {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.src--viewer {
  background: rgb(var(--v-theme-activity-viewer));
  color: rgb(var(--v-theme-on-activity-viewer));
}

.src--app {
  background: rgba(var(--v-theme-on-surface), 0.12);
  color: rgb(var(--v-theme-on-surface));
}

.src--events {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.45);
}

.src--ext {
  background: rgb(var(--v-theme-activity-extension));
  color: rgb(var(--v-theme-on-activity-extension));
}

.activity-row__route {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-row__status {
  display: flex;
  justify-content: center;
}

.status--running {
  color: rgb(var(--v-theme-accent));
  animation: activity-spin 1s linear infinite;
}

.status--success {
  color: rgb(var(--v-theme-success));
}

.status--error,
.status--timeout {
  color: rgb(var(--v-theme-error));
}

.activity-row__duration {
  text-align: right;
  font-size: 11.5px;
  opacity: 0.75;
}

.duration--slow {
  color: rgb(var(--v-theme-accent));
  font-weight: 600;
  opacity: 1;
}

.duration--failed {
  color: rgb(var(--v-theme-error));
  font-weight: 600;
  opacity: 1;
}

.activity-detail {
  margin: 0 16px 6px 108px;
  padding: 6px 10px;
  border-left: 2px solid rgba(var(--v-theme-on-surface), 0.3);
  border-radius: 0 6px 6px 0;
  background: rgba(var(--v-theme-on-surface), 0.06);
  font-family: var(--activity-mono);
  font-size: 11.5px;
  line-height: 1.6;
  word-break: break-all;
  user-select: text;
}

.activity-detail--failed {
  border-left-color: rgb(var(--v-theme-error));
}

.activity-detail__key {
  display: inline-block;
  width: 52px;
  opacity: 0.6;
}

@keyframes activity-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
