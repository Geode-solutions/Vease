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

export function useVeaseChat() {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const provider = ref(CHAT_PROVIDER.LLAMA);
  const isCloudAiAllowed = ref(false);

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

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/llm/chat",
      body: () => ({ provider: provider.value }),
      headers: async () => {
        const token = await user.value?.getIdToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  });

  function toggleProvider() {
    if (!isCloudAiAllowed.value) {
      return;
    }
    provider.value =
      provider.value === CHAT_PROVIDER.LLAMA ? CHAT_PROVIDER.GATEWAY : CHAT_PROVIDER.LLAMA;
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
