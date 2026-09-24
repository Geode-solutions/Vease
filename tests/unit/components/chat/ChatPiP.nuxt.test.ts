import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
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
  },
}));

vi.mock(import("@vease/composables/chat"), () => ({
  useVeaseChat: vi.fn<typeof useVeaseChat>(),
}));

const USER_MESSAGE_ID = "msg-1";
const ASSISTANT_MESSAGE_ID = "msg-2";
const INPUT_TEXT = "Hello assistant";

describe("the ChatPiP component", () => {
  const sendMessageMock = vi.fn<(payload: { text: string }) => void>();

  beforeEach(() => {
    setupActivePinia();
    vi.mocked(useVeaseChat).mockReturnValue({
      messages: ref([
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
      ]),
      sendMessage: sendMessageMock,
      status: ref<string>("ready"),
      error: ref<{ message: string } | undefined>(undefined),
    } as unknown as ReturnType<typeof useVeaseChat>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    const closeBtn = wrapper.find(".pip-header button");
    await closeBtn.trigger("click");

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
    vi.mocked(useVeaseChat).mockReturnValue({
      messages: ref([]),
      sendMessage: sendMessageMock,
      status: ref<string>("streaming"),
      error: ref<{ message: string } | undefined>(undefined),
    } as unknown as ReturnType<typeof useVeaseChat>);

    const wrapper = mountWithPlugins(ChatPiP);

    const sendBtn = wrapper.find("form button");
    expect(sendBtn.attributes("disabled")).toBeDefined();
  });

  test("renders error message when chat composable emits error", () => {
    const errorMessageText = "Failed to load chat response";
    vi.mocked(useVeaseChat).mockReturnValue({
      messages: ref([]),
      sendMessage: sendMessageMock,
      status: ref<string>("ready"),
      error: ref<{ message: string } | undefined>({ message: errorMessageText }),
    } as unknown as ReturnType<typeof useVeaseChat>);

    const wrapper = mountWithPlugins(ChatPiP);

    expect(wrapper.text()).toContain(errorMessageText);
  });
});
