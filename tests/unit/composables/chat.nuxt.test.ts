import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useVeaseChat } from "@vease/composables/chat";
import * as aiSdkVue from "@ai-sdk/vue";

vi.mock("@ai-sdk/vue", () => ({
  useChat: vi.fn().mockReturnValue({
    messages: { value: [] },
    sendMessage: vi.fn(),
    status: { value: "ready" },
    error: { value: null },
    stop: vi.fn(),
    clearError: vi.fn(),
  }),
}));

describe("useVeaseChat composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes useChat with /api/llm/chat endpoint", () => {
    const chat = useVeaseChat();

    expect(aiSdkVue.useChat).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: expect.anything(),
      }),
    );
    expect(chat.messages.value).toEqual([]);
    expect(chat.status.value).toBe("ready");
  });
});
