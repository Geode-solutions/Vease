// Third party imports
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/vue";

// Local imports
import type { EntitlementResponse, GatewayKeyResponse } from "@geode/cloud-api/types";
import cloud_api_schemas from "@geode/cloud-api/cloud_api_schemas.json";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import vease_schemas from "vease/vease_typed_schemas.js";

const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

type LlamaStatus = { running: false } | { running: true };

interface VeaseChatReturn extends Pick<
  ReturnType<typeof useChat>,
  "messages" | "sendMessage" | "status" | "error" | "stop" | "clearError"
> {
  provider: Ref<ChatProvider>;
  toggleProvider: () => Promise<void>;
  isCloudAiAllowed: Ref<boolean>;
  CHAT_PROVIDER: typeof CHAT_PROVIDER;
  llamaStatus: Ref<LlamaStatus>;
  killLlamaServer: () => Promise<void>;
}

// oxlint-disable eslint/max-lines-per-function
export function useVeaseChat(): VeaseChatReturn {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const appStore = useAppStore();
  const provider = ref<ChatProvider>(CHAT_PROVIDER.LLAMA);
  const isCloudAiAllowed = ref(false);
  const gatewayApiKey = ref<string | undefined>(undefined);
  const llamaStatus = ref<LlamaStatus>({ running: false });

  async function refreshLlamaStatus(): Promise<void> {
    llamaStatus.value = await appStore.request({
      schema: vease_schemas.api.llm.status,
    });
  }

  async function killLlamaServer(): Promise<void> {
    await appStore.request({ schema: vease_schemas.api.llm.kill });
    llamaStatus.value = { running: false };
  }

  async function refreshCloudEntitlement(): Promise<void> {
    if (!user.value) {
      isCloudAiAllowed.value = false;
      gatewayApiKey.value = undefined;
      provider.value = CHAT_PROVIDER.LLAMA;
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { cloudAllowed } = await APIStore.request<EntitlementResponse>({
      schema: cloud_api_schemas.cloud_api.ai.entitlement,
      headers,
    });
    isCloudAiAllowed.value = cloudAllowed;
  }

  watch(user, refreshCloudEntitlement, { immediate: true });

  async function ensureGatewayKey(): Promise<void> {
    if (gatewayApiKey.value !== undefined || !user.value) {
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { apiKeyString } = await APIStore.request<GatewayKeyResponse>({
      schema: cloud_api_schemas.cloud_api.ai.key,
      headers,
    });
    gatewayApiKey.value = apiKeyString;
  }

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/llm/chat",
      headers: async (): Promise<Record<string, string>> => {
        const token = await user.value?.getIdToken();
        return token === undefined ? {} : { Authorization: `Bearer ${token}` };
      },
      body: (): { provider: ChatProvider; gatewayApiKey: string | undefined } => ({
        provider: provider.value,
        gatewayApiKey: gatewayApiKey.value,
      }),
    }),
  });

  void refreshLlamaStatus();
  watch(status, (chatStatus) => {
    if (chatStatus === "ready" && provider.value === CHAT_PROVIDER.LLAMA) {
      void refreshLlamaStatus();
    }
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
    llamaStatus,
    killLlamaServer,
  };
}
