<script setup>
import ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useUIStore } from "@vease/stores/ui";
import { useVeaseChat } from "@vease/composables/chat";

const UIStore = useUIStore();
const { messages, sendMessage, status, error } = useVeaseChat();

const input = ref("");
const messagesEnd = ref(undefined);

function close() {
  UIStore.setShowChatPiP(false);
}

function messageText(message) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function submit() {
  const text = input.value.trim();
  if (!text || status.value !== "ready") {
    return;
  }
  sendMessage({ text });
  input.value = "";
}

watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    messagesEnd.value?.scrollIntoView({ behavior: "smooth" });
  },
);
</script>

<template>
  <ResizablePiP
    storage-key="chat-pip"
    :escapeFunction="close"
    :default-width="420"
    :default-height="560"
    :min-width="320"
    :min-height="360"
  >
    <template #handle>
      <div
        class="pip-header d-flex align-center px-4"
        style="height: 40px; min-height: 40px; user-select: none"
      >
        <v-icon size="18" color="primary" class="mr-2">mdi-chat-outline</v-icon>
        <span class="text-subtitle-2 font-weight-bold text-white">Chat (beta)</span>
        <v-spacer />
        <v-btn icon size="x-small" variant="text" color="white" @click="close">
          <v-icon size="16">mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Close</v-tooltip>
        </v-btn>
      </div>
    </template>

    <div class="d-flex flex-column fill-height overflow-hidden">
      <div class="messages flex-grow-1 overflow-y-auto px-4 py-2">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-row d-flex mb-2"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div class="message-bubble pa-3 rounded-lg" :class="`message-${message.role}`">
            {{ messageText(message) }}
          </div>
        </div>
        <div v-if="error" class="text-error text-caption px-1">{{ error.message }}</div>
        <div ref="messagesEnd" />
      </div>

      <v-divider />

      <form class="d-flex align-center pa-2" @submit.prevent="submit">
        <v-text-field
          v-model="input"
          placeholder="Ask something..."
          density="compact"
          variant="solo"
          flat
          hide-details
          :disabled="status !== 'ready'"
          class="mr-2"
          @keydown.enter.exact.prevent="submit"
        />
        <v-btn
          icon
          size="small"
          color="primary"
          :loading="status === 'submitted' || status === 'streaming'"
          :disabled="!input.trim() || status !== 'ready'"
          @click="submit"
        >
          <v-icon size="18">mdi-send</v-icon>
        </v-btn>
      </form>
    </div>
  </ResizablePiP>
</template>

<style scoped>
.pip-header {
  cursor: grab;
}

.pip-header:active {
  cursor: grabbing;
}

.messages {
  min-height: 0;
}

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
</style>
