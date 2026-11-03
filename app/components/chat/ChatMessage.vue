<script setup lang="ts">
import { type UIMessage, getToolName, isTextUIPart, isToolUIPart } from "ai";

interface Props {
  message: UIMessage;
}

const { message } = defineProps<Props>();

interface ToolCall {
  id: string;
  name: string;
  state: "running" | "done" | "failed";
}

const TOOL_STATE_ICONS = {
  running: "mdi-cog-outline",
  done: "mdi-check",
  failed: "mdi-alert-circle-outline",
} as const;

const text = computed(() =>
  message.parts
    .filter((part) => isTextUIPart(part))
    .map((part) => part.text)
    .join(""),
);

// The assistant calls Vease tools between its answers: show them instead of an empty bubble
const toolCalls = computed<ToolCall[]>(() =>
  message.parts
    .filter((part) => isToolUIPart(part))
    .map((part) => {
      let state: ToolCall["state"] = "running";
      if (part.state === "output-available") {
        state = "done";
      } else if (part.state === "output-error" || part.state === "output-denied") {
        state = "failed";
      }
      return { id: part.toolCallId, name: getToolName(part), state };
    }),
);
</script>

<template>
  <div
    class="message-row d-flex mb-2"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="message-bubble pa-3 rounded-lg" :class="`message-${message.role}`">
      <div v-if="toolCalls.length > 0" class="d-flex flex-wrap ga-1" :class="{ 'mb-2': text }">
        <v-chip
          v-for="toolCall in toolCalls"
          :key="toolCall.id"
          data-testid="chatToolCall"
          size="x-small"
          variant="tonal"
          :color="toolCall.state === 'failed' ? 'error' : undefined"
          label
        >
          <v-icon size="12" class="mr-1" :class="{ 'tool-running': toolCall.state === 'running' }">
            {{ TOOL_STATE_ICONS[toolCall.state] }}
          </v-icon>
          {{ toolCall.name }}
        </v-chip>
      </div>
      <span v-if="text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  max-width: 80%;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-user {
  background-color: rgba(var(--v-theme-primary), 0.25);
}

.message-assistant {
  background-color: rgba(255, 255, 255, 0.08);
}

.tool-running {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
