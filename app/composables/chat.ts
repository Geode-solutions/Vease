// Third party imports
import { DefaultChatTransport } from "ai";
import { useAppStore } from "@ogw_front/stores/app";
import { useChat } from "@ai-sdk/vue";

// Local imports
import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "@vease/composables/auth";

import vease_schemas from "vease/vease_schemas.json" with { type: "json" };

const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

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

interface VeaseChatReturn extends Pick<
  ReturnType<typeof useChat>,
  "messages" | "sendMessage" | "status" | "error" | "stop" | "clearError"
> {
  provider: Ref<ChatProvider>;
  toggleProvider: () => Promise<void>;
  isCloudAiAllowed: Ref<boolean>;
  CHAT_PROVIDER: typeof CHAT_PROVIDER;
}

export function useVeaseChat(): VeaseChatReturn {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const appStore = useAppStore();
  const provider = ref<ChatProvider>(CHAT_PROVIDER.LLAMA);
  const isCloudAiAllowed = ref(false);
  let gatewayKeyReady = false;

  async function refreshCloudEntitlement(): Promise<void> {
    if (!user.value) {
      isCloudAiAllowed.value = false;
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { cloudAllowed } = (await APIStore.request({
      schema: ENTITLEMENT_SCHEMA,
      headers,
    })) as { cloudAllowed?: boolean };
    isCloudAiAllowed.value = Boolean(cloudAllowed);
  }

  watch(user, refreshCloudEntitlement, { immediate: true });

  async function ensureGatewayKey(): Promise<void> {
    if (gatewayKeyReady || !user.value) {
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { apiKeyString } = (await APIStore.request({ schema: KEY_SCHEMA, headers })) as {
      apiKeyString?: string;
    };
    const params = { apiKey: apiKeyString };
    await appStore.request({ schema: vease_schemas.api.llm.gateway_key, params });
    gatewayKeyReady = true;
  }

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/llm/chat",
      headers: async () => {
        const token = await user.value?.getIdToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      body: () => ({ provider: provider.value }),
    }),
  });

  async function toggleProvider(): Promise<void> {
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
