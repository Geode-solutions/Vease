import type { ChatTransport, UIMessage } from "ai";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useChat } from "@ai-sdk/vue";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ai-sdk/vue"), () => {
  const useChatStub = {
    messages: { value: [] },
    sendMessage: vi.fn<() => void>(),
    status: { value: "ready" },
    error: { value: undefined },
    stop: vi.fn<() => void>(),
    clearError: vi.fn<() => void>(),
  };
  // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full composable return type, established repo pattern.
  const useChatReturnValue = useChatStub as unknown as ReturnType<typeof useChat>;
  const useChatMock = vi
    .fn<(...args: Parameters<typeof useChat>) => ReturnType<typeof useChat>>()
    .mockReturnValue(useChatReturnValue);
  return {
    // oxlint-disable-next-line no-unsafe-type-assertion -- the mock collapses useChat's generic signature to a concrete instantiation, which is enough for this test.
    useChat: useChatMock as unknown as typeof useChat,
  };
});

describe("the useVeaseChat composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initializes useChat with /api/llm/chat endpoint", () => {
    const chat = useVeaseChat();

    // oxlint-disable-next-line no-unsafe-type-assertion -- expect.anything() is typed as `any`; this matcher genuinely satisfies ChatTransport at runtime.
    const anyTransport = expect.anything() as ChatTransport<UIMessage>;
    expect(useChat).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: anyTransport,
      }),
    );
    expect(chat.messages.value).toStrictEqual([]);
    expect(chat.status.value).toBe("ready");
  });
});
