<script setup lang="ts">
import ChatMessage from "@vease/components/chat/ChatMessage.vue";
import ChatProviderSwitch from "@vease/components/chat/ChatProviderSwitch.vue";
import ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useUIStore } from "@vease/stores/ui";
import { useVeaseChat } from "@vease/composables/chat";

const UIStore = useUIStore();
const {
  messages,
  sendMessage,
  regenerate,
  status,
  error,
  clearError,
  provider,
  setProvider,
  isSwitchingProvider,
  providerError,
  providerSwitches,
  cloudUnavailableReason,
  CHAT_PROVIDER,
  llamaStatus,
  killLlamaServer,
} = useVeaseChat();

const PROVIDER_LABELS: Record<string, string> = {
  [CHAT_PROVIDER.LLAMA]: "Local",
  [CHAT_PROVIDER.GATEWAY]: "Cloud",
};

const input = ref("");
const messagesEnd = useTemplateRef("messagesEnd");

const isBusy = computed(() => status.value === "submitted" || status.value === "streaming");
const isLocal = computed(() => provider.value === CHAT_PROVIDER.LLAMA);

const localModelStatus = computed(() => {
  if (llamaStatus.value.running) {
    return { color: "success", text: "Local model ready" };
  }
  if (llamaStatus.value.starting) {
    return { color: "warning", text: "Starting local model..." };
  }
  return { color: "grey", text: "Starts with your first message" };
});

const pendingText = computed(() =>
  isLocal.value && !llamaStatus.value.running
    ? "Starting the local model... The first start downloads it, this can take a few minutes."
    : "Thinking...",
);

function close(): void {
  UIStore.setShowChatPiP(false);
}

function switchesAfter(index: number): typeof providerSwitches.value {
  return providerSwitches.value.filter((change) => change.afterMessageCount === index + 1);
}

function submit(): void {
  const text = input.value.trim();
  if (!text || status.value !== "ready") {
    return;
  }
  sendMessage({ text });
  input.value = "";
}

async function retry(): Promise<void> {
  clearError();
  await regenerate();
}

watch(
  () => [messages.value.length, status.value],
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
      <div class="px-4 pt-2 pb-2">
        <ChatProviderSwitch
          :provider="provider"
          :cloud-unavailable-reason="cloudUnavailableReason"
          :disabled="isBusy"
          :loading="isSwitchingProvider"
          @select="setProvider"
        />
        <div
          v-if="isLocal"
          data-testid="localModelStatus"
          class="d-flex align-center mt-1"
          style="min-height: 24px"
        >
          <v-icon size="10" :color="localModelStatus.color" class="mr-1">mdi-circle</v-icon>
          <span class="text-caption">{{ localModelStatus.text }}</span>
          <v-spacer />
          <span v-if="llamaStatus.running">
            <v-btn
              size="x-small"
              variant="text"
              color="error"
              :disabled="isBusy"
              @click="killLlamaServer"
            >
              <v-icon size="14" class="mr-1">mdi-stop-circle-outline</v-icon>
              Stop
            </v-btn>
            <v-tooltip activator="parent" location="top">
              Stop the local model to free up memory, it restarts with the next message
            </v-tooltip>
          </span>
        </div>
        <v-alert
          v-if="providerError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-2 text-caption"
          closable
          @click:close="providerError = undefined"
        >
          {{ providerError }}
        </v-alert>
      </div>

      <v-divider />

      <div class="messages flex-grow-1 overflow-y-auto px-4 py-2">
        <div
          v-if="messages.length === 0"
          data-testid="chatEmptyState"
          class="d-flex flex-column align-center justify-center text-center fill-height px-4"
        >
          <v-icon size="36" color="primary" class="mb-2">mdi-chat-question-outline</v-icon>
          <div class="text-subtitle-2 text-white">How can I help?</div>
          <div class="text-caption text-medium-emphasis mt-1">
            Ask a question about Vease or your project, the assistant can use Vease tools to answer.
          </div>
        </div>
        <template v-for="(message, index) in messages" :key="message.id">
          <ChatMessage :message="message" />
          <div
            v-for="change in switchesAfter(index)"
            :key="`switch-${change.afterMessageCount}-${change.provider}`"
            data-testid="chatProviderSwitchMarker"
            class="d-flex align-center my-3 text-caption text-medium-emphasis"
          >
            <v-divider />
            <span class="mx-2 text-no-wrap">
              Continued with the {{ PROVIDER_LABELS[change.provider] }} AI
            </span>
            <v-divider />
          </div>
        </template>
        <div
          v-if="status === 'submitted'"
          data-testid="chatPendingAnswer"
          class="d-flex justify-start mb-2"
        >
          <div class="pending-bubble pa-3 rounded-lg d-flex align-center text-caption">
            <v-progress-circular indeterminate size="14" width="2" class="mr-2 flex-shrink-0" />
            {{ pendingText }}
          </div>
        </div>
        <v-alert
          v-if="error"
          data-testid="chatError"
          type="error"
          variant="tonal"
          density="compact"
          class="text-caption"
        >
          {{ error.message }}
          <template #append>
            <v-btn size="x-small" variant="text" @click="retry">Retry</v-btn>
          </template>
        </v-alert>
        <div ref="messagesEnd" />
      </div>

      <v-divider />

      <form class="d-flex align-center pa-2" @submit.prevent="submit">
        <v-text-field
          v-model="input"
          :placeholder="`Ask the ${PROVIDER_LABELS[provider]} AI...`"
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
          :loading="isBusy"
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

.pending-bubble {
  max-width: 80%;
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
