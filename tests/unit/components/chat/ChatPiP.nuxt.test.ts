import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useUIStore } from "@vease/stores/ui";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/Layout/ResizablePiP.vue"), () => ({
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
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of ResizablePiP this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  } as unknown as typeof ResizablePiP,
}));

vi.mock(import("@vease/composables/chat"), () => ({
  useVeaseChat: vi.fn<typeof useVeaseChat>(),
}));

const USER_MESSAGE_ID = "msg-1";
const ASSISTANT_MESSAGE_ID = "msg-2";
const INPUT_TEXT = "Hello assistant";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;

interface ChatMockOptions {
  messages?: unknown[];
  status?: string;
  error?: { message: string };
  provider?: string;
  isCloudAiAllowed?: boolean;
  llamaRunning?: boolean;
}

function findButton(
  wrapper: ReturnType<typeof mountWithPlugins>,
  label: string,
): ReturnType<ReturnType<typeof mountWithPlugins>["find"]> {
  const button = wrapper.findAll("button").find((btn) => btn.text().includes(label));
  if (button === undefined) {
    throw new Error(`No button labelled "${label}"`);
  }
  return button;
}

describe("the ChatPiP component", () => {
  const sendMessageMock = vi.fn<(payload: { text: string }) => void>();
  const toggleProviderMock = vi.fn<() => Promise<void>>();
  const killLlamaServerMock = vi.fn<() => Promise<void>>();

  function mockChat({
    messages = [],
    status = "ready",
    error,
    provider = CHAT_PROVIDER.LLAMA,
    isCloudAiAllowed = false,
    llamaRunning = false,
  }: ChatMockOptions = {}): void {
    vi.mocked(useVeaseChat).mockReturnValue({
      messages: ref(messages),
      sendMessage: sendMessageMock,
      status: ref<string>(status),
      error: ref<{ message: string } | undefined>(error),
      provider: ref<string>(provider),
      toggleProvider: toggleProviderMock,
      isCloudAiAllowed: ref<boolean>(isCloudAiAllowed),
      CHAT_PROVIDER,
      llamaStatus: ref<{ running: boolean }>({ running: llamaRunning }),
      killLlamaServer: killLlamaServerMock,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
    } as unknown as ReturnType<typeof useVeaseChat>);
  }

  beforeEach(() => {
    setupActivePinia();
    mockChat({
      messages: [
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
      ],
    });
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

    const input = wrapper.find("input");
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

  test("renders error message when chat composable emits error", () => {
    const errorMessageText = "Failed to load chat response";
    mockChat({ error: { message: errorMessageText } });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.text()).toContain(errorMessageText);
  });

  describe("with the local provider", () => {
    test("shows a stopped local model without a stop button", () => {
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.text()).toContain("Local model stopped");
      expect(wrapper.findAll("button").some((btn) => btn.text().includes("Stop"))).toBe(false);
    });

    test("stops a running local model when the stop button is clicked", async () => {
      mockChat({ llamaRunning: true });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.text()).toContain("Local model running");
      await findButton(wrapper, "Stop").trigger("click");

      expect(killLlamaServerMock).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    test("disables the provider toggle when cloud AI is not allowed", () => {
      const wrapper = mountWithPlugins(ChatPiP);

      expect(findButton(wrapper, "Local").attributes("disabled")).toBeDefined();
    });

    test("toggles the provider when cloud AI is allowed", async () => {
      mockChat({ isCloudAiAllowed: true });
      const wrapper = mountWithPlugins(ChatPiP);

      const toggleBtn = findButton(wrapper, "Local");
      expect(toggleBtn.attributes("disabled")).toBeUndefined();
      await toggleBtn.trigger("click");

      expect(toggleProviderMock).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe("with the cloud provider", () => {
    test("shows the cloud label and hides the local model status", () => {
      mockChat({ provider: CHAT_PROVIDER.GATEWAY, isCloudAiAllowed: true, llamaRunning: true });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(findButton(wrapper, "Cloud").exists()).toBe(true);
      expect(wrapper.text()).not.toContain("Local model");
    });
  });
});
