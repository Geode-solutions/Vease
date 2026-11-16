import { computed, ref } from "vue";
import type { mountWithPlugins } from "@vease_tests/utils";
import { useAuth } from "@vease/composables/auth";
import { useVeaseChat } from "@vease/composables/chat";
import { vi } from "vitest";

const USER_MESSAGE_ID = "msg-1";
const ASSISTANT_MESSAGE_ID = "msg-2";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
const CLOUD_UNAVAILABLE_REASON = {
  SIGNED_OUT: "signed_out",
  NOT_ENTITLED: "not_entitled",
} as const;
const CONVERSATION = [
  {
    id: USER_MESSAGE_ID,
    role: "user",
    parts: [{ type: "text", text: "User prompt" }],
  },
  {
    id: ASSISTANT_MESSAGE_ID,
    role: "assistant",
    parts: [{ type: "text", text: "Assistant response" }],
  },
];

interface ChatMockOptions {
  messages?: unknown[];
  status?: string;
  error?: { message: string };
  provider?: string;
  cloudUnavailableReason?: string;
  llamaRunning?: boolean;
  llamaStarting?: boolean;
  providerSwitches?: { afterMessageCount: number; provider: string }[];
}

type Wrapper = ReturnType<typeof mountWithPlugins>;

const chatPipMocks = {
  sendMessage: vi.fn<(payload: { text: string }) => void>(),
  regenerate: vi.fn<() => Promise<void>>(),
  clearError: vi.fn<() => void>(),
  setProvider: vi.fn<(provider: string) => Promise<void>>(),
  killLlamaServer: vi.fn<() => Promise<void>>(),
};

// Requires the test file to vi.mock the auth composable
function mockAuth(isAuthenticated: boolean): void {
  vi.mocked(useAuth).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
    {
      isUserAuthenticated: computed(() => isAuthenticated),
    } as unknown as ReturnType<typeof useAuth>,
  );
}

// Requires the test file to vi.mock the chat composable
function mockChat(options: ChatMockOptions = {}): void {
  const {
    messages = CONVERSATION,
    status = "ready",
    error,
    provider = CHAT_PROVIDER.LLAMA,
    llamaRunning = false,
    llamaStarting = false,
    providerSwitches = [],
  } = options;
  // An explicit undefined means that cloud AI is allowed
  const cloudUnavailableReason =
    "cloudUnavailableReason" in options
      ? options.cloudUnavailableReason
      : CLOUD_UNAVAILABLE_REASON.NOT_ENTITLED;
  // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
  vi.mocked(useVeaseChat).mockReturnValue({
    messages: ref(messages),
    sendMessage: chatPipMocks.sendMessage,
    regenerate: chatPipMocks.regenerate,
    clearError: chatPipMocks.clearError,
    status: ref<string>(status),
    error: ref<{ message: string } | undefined>(error),
    provider: ref<string>(provider),
    setProvider: chatPipMocks.setProvider,
    isSwitchingProvider: ref(false),
    providerError: ref<string | undefined>(undefined),
    providerSwitches: ref(providerSwitches),
    cloudUnavailableReason: computed(() => cloudUnavailableReason),
    CHAT_PROVIDER,
    CLOUD_UNAVAILABLE_REASON,
    llamaStatus: ref({ running: llamaRunning, starting: llamaStarting }),
    killLlamaServer: chatPipMocks.killLlamaServer,
  } as unknown as ReturnType<typeof useVeaseChat>);
}

function findButton(wrapper: Wrapper, label: string): ReturnType<Wrapper["find"]> {
  const button = wrapper.findAll("button").find((btn) => btn.text().includes(label));
  if (button === undefined) {
    throw new Error(`No button labelled "${label}"`);
  }
  return button;
}

export {
  ASSISTANT_MESSAGE_ID,
  CHAT_PROVIDER,
  type Wrapper,
  chatPipMocks,
  findButton,
  mockAuth,
  mockChat,
};
