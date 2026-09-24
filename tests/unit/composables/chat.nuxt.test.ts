import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useChat } from "@ai-sdk/vue";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ai-sdk/vue"), () => ({
  useChat: vi.fn<typeof useChat>().mockReturnValue({
    messages: { value: [] },
    sendMessage: vi.fn<() => void>(),
    status: { value: "ready" },
    error: { value: undefined },
    stop: vi.fn<() => void>(),
    clearError: vi.fn<() => void>(),
  } as unknown as ReturnType<typeof useChat>),
}));

describe("the useVeaseChat composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes useChat with /api/llm/chat endpoint", () => {
    const chat = useVeaseChat();

    expect(useChat).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: expect.anything(),
      }),
    );
    expect(chat.messages.value).toStrictEqual([]);
    expect(chat.status.value).toBe("ready");
  });
});
