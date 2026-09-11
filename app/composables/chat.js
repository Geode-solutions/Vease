// Third party imports
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/vue";

// Local imports
import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "@vease/composables/auth";

const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" };

const ENTITLEMENT_SCHEMA = {
  $id: "/ai/entitlement",
  methods: ["GET"],
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
};

const KEY_SCHEMA = {
  $id: "/ai/key",
  methods: ["GET"],
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
};

export function useVeaseChat() {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const provider = ref(CHAT_PROVIDER.LLAMA);
  const isCloudAiAllowed = ref(false);
  let gatewayKeyReady = false;

  async function refreshCloudEntitlement() {
    if (!user.value) {
      isCloudAiAllowed.value = false;
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { cloudAllowed } = await APIStore.request({ schema: ENTITLEMENT_SCHEMA, headers });
    isCloudAiAllowed.value = Boolean(cloudAllowed);
  }

  watch(user, refreshCloudEntitlement, { immediate: true });

  // Fetches this user's own Vercel AI Gateway key (budget-capped, minted once
  // per user by Vease-API) and hands it to the local Nitro server, which is
  // the one that actually calls the Gateway. Cached for the session so we
  // don't re-fetch it on every message.
  async function ensureGatewayKey() {
    if (gatewayKeyReady || !user.value) {
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { apiKeyString } = await APIStore.request({ schema: KEY_SCHEMA, headers });
    await $fetch("/api/llm/gateway-key", { method: "POST", body: { apiKey: apiKeyString } });
    gatewayKeyReady = true;
  }

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/llm/chat",
      body: () => ({ provider: provider.value }),
    }),
  });

  async function toggleProvider() {
    if (!isCloudAiAllowed.value) {
      return;
    }
    const nextProvider =
      provider.value === CHAT_PROVIDER.LLAMA ? CHAT_PROVIDER.GATEWAY : CHAT_PROVIDER.LLAMA;
    if (nextProvider === CHAT_PROVIDER.GATEWAY) {
      await ensureGatewayKey();
    }
    provider.value = nextProvider;
  }

  return {
    messages,
    sendMessage,
    status,
    error,
    stop,
    clearError,
    provider,
    toggleProvider,
    isCloudAiAllowed,
    CHAT_PROVIDER,
  };
}
