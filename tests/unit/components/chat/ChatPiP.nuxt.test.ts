import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useUIStore } from "@vease/stores/ui";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/Layout/ResizablePiP.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of ResizablePiP this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  default: {
    name: "ResizablePiP",
    props: [
      "storageKey",
      "escapeFunction",
      "defaultWidth",
      "defaultHeight",
      "minWidth",
      "minHeight",
    ],
    template: "<div class='resizable-pip-stub'><slot name='handle' /><slot /></div>",
  } as unknown as typeof ResizablePiP,
}));

vi.mock(import("@vease/composables/chat"), () => ({
  useVeaseChat: vi.fn<typeof useVeaseChat>(),
}));

const USER_MESSAGE_ID = "msg-1";
const ASSISTANT_MESSAGE_ID = "msg-2";
const INPUT_TEXT = "Hello assistant";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
const CLOUD_UNAVAILABLE_REASON = {
  SIGNED_OUT: "signed_out",
  NOT_ENTITLED: "not_entitled",
} as const;
const CONVERSATION = [
  { id: USER_MESSAGE_ID, role: "user", parts: [{ type: "text", text: "User prompt" }] },
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

function findButton(wrapper: Wrapper, label: string): ReturnType<Wrapper["find"]> {
  const button = wrapper.findAll("button").find((btn) => btn.text().includes(label));
  if (button === undefined) {
    throw new Error(`No button labelled "${label}"`);
  }
  return button;
}

describe("the ChatPiP component", () => {
  const sendMessageMock = vi.fn<(payload: { text: string }) => void>();
  const regenerateMock = vi.fn<() => Promise<void>>();
  const clearErrorMock = vi.fn<() => void>();
  const setProviderMock = vi.fn<(provider: string) => Promise<void>>();
  const killLlamaServerMock = vi.fn<() => Promise<void>>();

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
        : CLOUD_UNAVAILABLE_REASON.SIGNED_OUT;
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
    vi.mocked(useVeaseChat).mockReturnValue({
      messages: ref(messages),
      sendMessage: sendMessageMock,
      regenerate: regenerateMock,
      clearError: clearErrorMock,
      status: ref<string>(status),
      error: ref<{ message: string } | undefined>(error),
      provider: ref<string>(provider),
      setProvider: setProviderMock,
      isSwitchingProvider: ref(false),
      providerError: ref<string | undefined>(undefined),
      providerSwitches: ref(providerSwitches),
      cloudUnavailableReason: computed(() => cloudUnavailableReason),
      CHAT_PROVIDER,
      CLOUD_UNAVAILABLE_REASON,
      llamaStatus: ref({ running: llamaRunning, starting: llamaStarting }),
      killLlamaServer: killLlamaServerMock,
    } as unknown as ReturnType<typeof useVeaseChat>);
  }

  beforeEach(() => {
    setupActivePinia();
    vi.clearAllMocks();
    mockChat();
  });

  test("renders the chat component header and messages", () => {
    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.text()).toContain("Chat (beta)");
    expect(wrapper.text()).toContain("User prompt");
    expect(wrapper.text()).toContain("Assistant response");
  });

  test("closes the chat pip when the close button is clicked", async () => {
    const uiStore = useUIStore();
    const setShowChatPiPSpy = vi.spyOn(uiStore, "setShowChatPiP");

    const wrapper = mountWithPlugins(ChatPiP);

    const closeBtn = wrapper.findAll(".pip-header button").at(-1);
    await closeBtn?.trigger("click");

    expect(setShowChatPiPSpy).toHaveBeenCalledWith(false);
  });

  test("submits input text when status is ready", async () => {
    const wrapper = mountWithPlugins(ChatPiP);

    const input = wrapper.find("form input");
    await input.setValue(INPUT_TEXT);
    const form = wrapper.find("form");
    await form.trigger("submit.prevent");

    expect(sendMessageMock).toHaveBeenCalledWith({ text: INPUT_TEXT });
  });

  test("disables send button when status is not ready", () => {
    mockChat({ status: "streaming" });

    const wrapper = mountWithPlugins(ChatPiP);

    const sendBtn = wrapper.find("form button");
    expect(sendBtn.attributes("disabled")).toBeDefined();
  });

  test("explains what the assistant can do before the first message", () => {
    mockChat({ messages: [] });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatEmptyState"]').exists()).toBe(true);
  });

  test("shows the tools the assistant calls", () => {
    mockChat({
      messages: [
        {
          id: ASSISTANT_MESSAGE_ID,
          role: "assistant",
          parts: [
            {
              type: "dynamic-tool",
              toolName: "get_info",
              toolCallId: "call-1",
              state: "output-available",
              input: {},
              output: {},
            },
          ],
        },
      ],
    });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatToolCall"]').text()).toContain("get_info");
  });

  test("renders the error with a retry button", async () => {
    const errorMessageText = "Failed to load chat response";
    mockChat({ status: "error", error: { message: errorMessageText } });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatError"]').text()).toContain(errorMessageText);
    await findButton(wrapper, "Retry").trigger("click");

    expect(clearErrorMock).toHaveBeenCalledWith();
    expect(regenerateMock).toHaveBeenCalledWith();
  });

  test("marks where the conversation continues with another provider", () => {
    mockChat({ providerSwitches: [{ afterMessageCount: 2, provider: CHAT_PROVIDER.GATEWAY }] });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatProviderSwitchMarker"]').text()).toContain("Cloud");
  });

  describe("the provider switch", () => {
    test("locks the cloud provider and explains why when signed out", async () => {
      const wrapper = mountWithPlugins(ChatPiP);

      const cloudBtn = wrapper.find('[data-testid="chatProvider-gateway"]');
      expect(cloudBtn.attributes("disabled")).toBeDefined();
      expect(wrapper.find('[data-testid="cloudUnavailableMessage"]').text()).toContain("Sign in");
      await cloudBtn.trigger("click");

      expect(setProviderMock).not.toHaveBeenCalled();
    });

    test("explains when the account is not entitled to cloud AI", () => {
      mockChat({ cloudUnavailableReason: CLOUD_UNAVAILABLE_REASON.NOT_ENTITLED });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="cloudUnavailableMessage"]').text()).toContain(
        "authorized accounts",
      );
    });

    test("selects the cloud provider when it is allowed", async () => {
      mockChat({ cloudUnavailableReason: undefined });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="cloudUnavailableMessage"]').exists()).toBe(false);
      await wrapper.find('[data-testid="chatProvider-gateway"]').trigger("click");

      expect(setProviderMock).toHaveBeenCalledWith(CHAT_PROVIDER.GATEWAY);
    });

    test("describes the selected provider", () => {
      mockChat({ provider: CHAT_PROVIDER.GATEWAY, cloudUnavailableReason: undefined });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.text()).toContain("messages are sent online");
    });
  });

  describe("with the local provider", () => {
    test("tells that the local model starts with the first message", () => {
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').text()).toContain(
        "Starts with your first message",
      );
      expect(wrapper.findAll("button").some((btn) => btn.text().includes("Stop"))).toBe(false);
    });

    test("explains the wait while the local model starts", () => {
      mockChat({ status: "submitted", llamaStarting: true });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').text()).toContain(
        "Starting local model",
      );
      expect(wrapper.find('[data-testid="chatPendingAnswer"]').text()).toContain(
        "can take a few minutes",
      );
    });

    test("stops a running local model when the stop button is clicked", async () => {
      mockChat({ llamaRunning: true });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.text()).toContain("Local model ready");
      await findButton(wrapper, "Stop").trigger("click");

      expect(killLlamaServerMock).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe("with the cloud provider", () => {
    test("hides the local model status", () => {
      mockChat({
        provider: CHAT_PROVIDER.GATEWAY,
        cloudUnavailableReason: undefined,
        llamaRunning: true,
      });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').exists()).toBe(false);
    });

    test("shows a plain pending answer", () => {
      mockChat({
        provider: CHAT_PROVIDER.GATEWAY,
        cloudUnavailableReason: undefined,
        status: "submitted",
      });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="chatPendingAnswer"]').text()).toContain("Thinking");
    });
  });
});
