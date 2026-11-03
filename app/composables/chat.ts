// Third party imports
import { type ChatStatus, DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/vue";
import { useIntervalFn } from "@vueuse/core";

// Local imports
import cloud_api_schemas from "@geode/cloud-api/cloud_api_typed_schemas.js";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import vease_schemas from "vease/vease_typed_schemas.js";

const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

const CLOUD_UNAVAILABLE_REASON = {
  SIGNED_OUT: "signed_out",
  NOT_ENTITLED: "not_entitled",
} as const;
type CloudUnavailableReason =
  (typeof CLOUD_UNAVAILABLE_REASON)[keyof typeof CLOUD_UNAVAILABLE_REASON];

interface LlamaStatus {
  running: boolean;
  starting: boolean;
}

// Marks where the conversation continues with another provider
interface ProviderSwitch {
  afterMessageCount: number;
  provider: ChatProvider;
}

const LLAMA_STATUS_POLL_MILLISECONDS = 2000;

interface VeaseChatReturn extends Pick<
  ReturnType<typeof useChat>,
  "messages" | "sendMessage" | "regenerate" | "status" | "error" | "stop" | "clearError"
> {
  provider: Ref<ChatProvider>;
  setProvider: (nextProvider: ChatProvider) => Promise<void>;
  isSwitchingProvider: Ref<boolean>;
  providerError: Ref<string | undefined>;
  providerSwitches: Ref<ProviderSwitch[]>;
  isCloudAiAllowed: Ref<boolean>;
  cloudUnavailableReason: ComputedRef<CloudUnavailableReason | undefined>;
  CHAT_PROVIDER: typeof CHAT_PROVIDER;
  CLOUD_UNAVAILABLE_REASON: typeof CLOUD_UNAVAILABLE_REASON;
  llamaStatus: Ref<LlamaStatus>;
  killLlamaServer: () => Promise<void>;
}

// The local model starts with the first message: follow its startup until it answers
function useLlamaStatus(
  status: Ref<ChatStatus>,
  provider: Ref<ChatProvider>,
): Pick<VeaseChatReturn, "llamaStatus" | "killLlamaServer"> {
  const appStore = useAppStore();
  const llamaStatus = ref<LlamaStatus>({ running: false, starting: false });

  async function refreshLlamaStatus(): Promise<void> {
    const { running, starting } = await appStore.request({
      schema: vease_schemas.api.llm.status,
    });
    llamaStatus.value = { running, starting };
  }

  async function killLlamaServer(): Promise<void> {
    await appStore.request({ schema: vease_schemas.api.llm.kill });
    llamaStatus.value = { running: false, starting: false };
  }

  const polling = useIntervalFn(
    () => {
      void refreshLlamaStatus();
    },
    LLAMA_STATUS_POLL_MILLISECONDS,
    { immediate: false },
  );

  void refreshLlamaStatus();
  watch(status, (chatStatus) => {
    if (provider.value !== CHAT_PROVIDER.LLAMA) {
      return;
    }
    if (chatStatus === "submitted" && !llamaStatus.value.running) {
      polling.resume();
      return;
    }
    polling.pause();
    if (chatStatus === "ready" || chatStatus === "error") {
      void refreshLlamaStatus();
    }
  });

  return { llamaStatus, killLlamaServer };
}

// oxlint-disable eslint/max-lines-per-function
export function useVeaseChat(): VeaseChatReturn {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const provider = ref<ChatProvider>(CHAT_PROVIDER.LLAMA);
  const isSwitchingProvider = ref(false);
  const providerError = ref<string | undefined>(undefined);
  const providerSwitches = ref<ProviderSwitch[]>([]);
  const isCloudAiAllowed = ref(false);
  const gatewayApiKey = ref<string | undefined>(undefined);

  const cloudUnavailableReason = computed<CloudUnavailableReason | undefined>(() => {
    if (!user.value) {
      return CLOUD_UNAVAILABLE_REASON.SIGNED_OUT;
    }
    return isCloudAiAllowed.value ? undefined : CLOUD_UNAVAILABLE_REASON.NOT_ENTITLED;
  });

  async function refreshCloudEntitlement(): Promise<void> {
    if (!user.value) {
      isCloudAiAllowed.value = false;
      gatewayApiKey.value = undefined;
      provider.value = CHAT_PROVIDER.LLAMA;
      return;
    }
    const token = await user.value.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };
    const { cloudAllowed } = await APIStore.request({
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
    const { apiKeyString } = await APIStore.request({
      schema: cloud_api_schemas.cloud_api.ai.key,
      headers,
    });
    gatewayApiKey.value = apiKeyString;
  }

  const { messages, sendMessage, regenerate, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/llm/chat",
      headers: async (): Promise<Record<string, string>> => {
        const token = await user.value?.getIdToken();
        if (token === undefined) {
          return {};
        }
        return { Authorization: `Bearer ${token}` };
      },
      body: (): { provider: ChatProvider; gatewayApiKey: string | undefined } => ({
        provider: provider.value,
        gatewayApiKey: gatewayApiKey.value,
      }),
    }),
  });

  const { llamaStatus, killLlamaServer } = useLlamaStatus(status, provider);

  async function setProvider(nextProvider: ChatProvider): Promise<void> {
    // After an error, switching provider is the way out: only an answer in progress blocks it
    const isAnswering = status.value === "submitted" || status.value === "streaming";
    if (nextProvider === provider.value || isAnswering) {
      return;
    }
    if (nextProvider === CHAT_PROVIDER.GATEWAY && !isCloudAiAllowed.value) {
      return;
    }
    providerError.value = undefined;
    isSwitchingProvider.value = true;
    try {
      if (nextProvider === CHAT_PROVIDER.GATEWAY) {
        await ensureGatewayKey();
      }
    } catch {
      providerError.value = "Could not connect to the cloud AI, please try again.";
      return;
    } finally {
      isSwitchingProvider.value = false;
    }
    if (messages.value.length > 0) {
      providerSwitches.value.push({
        afterMessageCount: messages.value.length,
        provider: nextProvider,
      });
    }
    provider.value = nextProvider;
  }

  return {
    messages,
    sendMessage,
    regenerate,
    status,
    error,
    stop,
    clearError,
    provider,
    setProvider,
    isSwitchingProvider,
    providerError,
    providerSwitches,
    isCloudAiAllowed,
    cloudUnavailableReason,
    CHAT_PROVIDER,
    CLOUD_UNAVAILABLE_REASON,
    llamaStatus,
    killLlamaServer,
  };
}
