<script setup lang="ts">
import type { ConsoleEntry } from "@ogw_front/stores/console";

import {
  KNOWN_SOURCES,
  formatDuration,
  formatTime,
  isFailed,
  isSlow,
  routeParts,
} from "@vease/utils/console_display";

const { entry, now, expanded } = defineProps<{
  entry: ConsoleEntry;
  now: number;
  expanded: boolean;
}>();
const emit = defineEmits<{ toggle: [] }>();

const STATUS_ICONS: Record<ConsoleEntry["status"], string> = {
  running: "ph-circle-notch",
  success: "ph-check",
  error: "ph-x",
  timeout: "ph-x",
  info: "",
};

const parts = computed(() => routeParts(entry.route));
const failed = computed(() => isFailed(entry));
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
    class="console-row"
    :class="{
      'console-row--failed': failed,
      'console-row--open': expanded,
      'console-row--clickable': hasDetail,
    }"
    data-testid="consoleRow"
    @click="toggle"
  >
    <span class="console-row__time">{{ formatTime(entry.started_at) }}</span>
    <span class="console-row__source" :class="sourceClass">{{ entry.source }}</span>
    <span class="console-row__route">
      <template v-if="entry.kind === 'connection'">
        <v-icon size="13" :icon="failed ? 'ph-plugs' : 'ph-plugs-connected'" class="mr-1" />{{
          entry.route
        }}
      </template>
      <template v-else>
        <span class="text-medium-emphasis">{{ parts.scope }}</span
        >{{ parts.name }}
        <span v-if="entry.label" class="text-medium-emphasis"> · {{ entry.label }}</span>
      </template>
    </span>
    <span
      class="console-row__status"
      :class="`status--${entry.kind === 'event' ? 'event' : entry.status}`"
    >
      <v-icon v-if="statusIcon" size="14" :icon="statusIcon" />
    </span>
    <span
      class="console-row__duration"
      :class="{
        'duration--failed': failed,
        'duration--slow': !failed && isSlow(elapsed),
      }"
    >
      {{ durationText }}
    </span>
  </div>
  <div v-if="expanded" class="console-detail" :class="{ 'console-detail--failed': failed }">
    <div v-if="entry.params"><span class="console-detail__key">params</span>{{ entry.params }}</div>
    <div v-if="entry.error">
      <span class="console-detail__key">error</span>
      <span class="text-error">{{ entry.error }}</span>
    </div>
  </div>
</template>

<style scoped>
.console-row {
  display: grid;
  grid-template-columns: 92px 64px minmax(0, 1fr) 20px 64px;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  padding: 0 16px;
  font-family: var(--console-mono);
  font-size: 12px;
}

.console-row--clickable {
  cursor: pointer;
}

.console-row:hover,
.console-row--open {
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.console-row--failed {
  background: rgba(var(--v-theme-error), 0.08);
}

.console-row__time {
  font-size: 11px;
  opacity: 0.6;
}

.console-row__source {
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
  background: #3e6965;
  color: #e8eef0;
}

.src--app {
  background: rgba(var(--v-theme-on-surface), 0.12);
  color: rgb(var(--v-theme-on-surface));
}

.src--events {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.45);
}

.src--ext {
  background: #be8388;
  color: #1e1e1e;
}

.console-row__route {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.console-row__status {
  display: flex;
  justify-content: center;
}

.status--running {
  color: rgb(var(--v-theme-accent));
  animation: console-spin 1s linear infinite;
}

.status--success {
  color: rgb(var(--v-theme-success));
}

.status--error,
.status--timeout {
  color: rgb(var(--v-theme-error));
}

.console-row__duration {
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

.console-detail {
  margin: 0 16px 6px 108px;
  padding: 6px 10px;
  border-left: 2px solid rgba(var(--v-theme-on-surface), 0.3);
  border-radius: 0 6px 6px 0;
  background: rgba(var(--v-theme-on-surface), 0.06);
  font-family: var(--console-mono);
  font-size: 11.5px;
  line-height: 1.6;
  word-break: break-all;
  user-select: text;
}

.console-detail--failed {
  border-left-color: rgb(var(--v-theme-error));
}

.console-detail__key {
  display: inline-block;
  width: 52px;
  opacity: 0.6;
}

@keyframes console-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
