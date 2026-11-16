import {
  ASSISTANT_MESSAGE_ID,
  CHAT_PROVIDER,
  chatPipMocks,
  findButton,
  mockAuth,
  mockChat,
} from "@vease_tests/utils/chat_pip_harness";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import type { useAuth } from "@vease/composables/auth";
import { useUIStore } from "@vease/stores/ui";
import type { useVeaseChat } from "@vease/composables/chat";

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

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

const INPUT_TEXT = "Hello assistant";

describe("the ChatPiP component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.clearAllMocks();
    mockAuth(true);
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

  test("asks to sign in before using the chat", () => {
    mockAuth(false);

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatSignInRequired"]').text()).toContain("Sign in");
    expect(wrapper.find('[data-testid="chatProviderSwitch"]').exists()).toBe(false);
    expect(wrapper.find("form").exists()).toBe(false);
  });

  test("submits input text when status is ready", async () => {
    const wrapper = mountWithPlugins(ChatPiP);

    const input = wrapper.find("form input");
    await input.setValue(INPUT_TEXT);
    const form = wrapper.find("form");
    await form.trigger("submit.prevent");

    expect(chatPipMocks.sendMessage).toHaveBeenCalledWith({ text: INPUT_TEXT });
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

    expect(chatPipMocks.clearError).toHaveBeenCalledWith();
    expect(chatPipMocks.regenerate).toHaveBeenCalledWith();
  });

  test("marks where the conversation continues with another provider", () => {
    mockChat({
      providerSwitches: [{ afterMessageCount: 2, provider: CHAT_PROVIDER.GATEWAY }],
    });

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.find('[data-testid="chatProviderSwitchMarker"]').text()).toContain("Cloud");
  });
});
