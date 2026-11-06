import {
  APP_BASE_URL,
  KILL_SCHEMA_ID,
  STATUS_SCHEMA_ID,
  type TransportOptions,
  appRequest,
  calledSchemaIds,
  chatState,
  lastTransportOptions,
  mockCloudApi,
  resetChatMocks,
} from "@vease_tests/utils/chat_harness";
import { DefaultChatTransport, type UIMessage } from "ai";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { setupActivePinia } from "@vease_tests/utils";
import type { useAppStore } from "@ogw_front/stores/app";
import type { useAuth } from "@vease/composables/auth";
import { useChat } from "@ai-sdk/vue";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

const { transportOptions } = vi.hoisted(() => ({
  transportOptions: [] as TransportOptions[],
}));

vi.mock(import("ai"), async (importOriginal) => {
  const actual = await importOriginal();
  // Records the options the composable builds its transport with, so the
  // Request headers/body callbacks can be exercised without sending a request.
  class RecordingChatTransport extends actual.DefaultChatTransport<UIMessage> {
    public constructor(options: ConstructorParameters<typeof actual.DefaultChatTransport>[0]) {
      super(options);
      // oxlint-disable-next-line no-unsafe-type-assertion -- the composable always passes `api` and function-valued `headers`/`body`, which the tests below rely on.
      transportOptions.push(options as unknown as TransportOptions);
    }
  }
  return { ...actual, DefaultChatTransport: RecordingChatTransport };
});

vi.mock(import("@ai-sdk/vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- the mock collapses useChat's generic signature to a concrete instantiation, which is enough for this test.
  useChat: vi.fn<() => unknown>() as unknown as typeof useChat,
}));

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

describe("the useVeaseChat composable", () => {
  beforeEach(() => {
    setupActivePinia();
    resetChatMocks(transportOptions);
  });

  test("initializes useChat with a transport", () => {
    const chat = useVeaseChat();

    // oxlint-disable-next-line no-unsafe-type-assertion -- expect.any() is typed as `any`; this matcher genuinely satisfies DefaultChatTransport at runtime.
    const anyTransport = expect.any(DefaultChatTransport) as DefaultChatTransport<UIMessage>;
    expect(useChat).toHaveBeenCalledWith({ transport: anyTransport });
    expect(chat.messages.value).toStrictEqual([]);
    expect(chat.status.value).toBe("ready");
    expect(chat.provider.value).toBe(chat.CHAT_PROVIDER.LLAMA);
  });

  test("sends the messages to the chat endpoint of the app server", () => {
    useVeaseChat();

    const request = lastTransportOptions(transportOptions).prepareSendMessagesRequest({
      id: "chat-id",
      messages: [],
      body: { provider: "llama" },
      trigger: "submit-message",
      messageId: undefined,
    });

    expect(request).toStrictEqual({
      api: `${APP_BASE_URL}/api/llm/chat`,
      body: {
        provider: "llama",
        id: "chat-id",
        messages: [],
        trigger: "submit-message",
        messageId: undefined,
      },
    });
  });

  test("fetches the local model status on creation", async () => {
    const { llamaStatus } = useVeaseChat();
    await flushPromises();

    expect(calledSchemaIds()).toStrictEqual([STATUS_SCHEMA_ID]);
    expect(llamaStatus.value).toMatchObject({ running: true });
  });

  test("refreshes the local model status once a llama answer is complete", async () => {
    useVeaseChat();
    await flushPromises();
    appRequest.mockClear();

    chatState.chatStatus.value = "streaming";
    await flushPromises();
    chatState.chatStatus.value = "ready";
    await flushPromises();

    expect(calledSchemaIds()).toStrictEqual([STATUS_SCHEMA_ID]);
  });

  test("stops the local model and marks it as stopped", async () => {
    const { killLlamaServer, llamaStatus } = useVeaseChat();
    await flushPromises();

    await killLlamaServer();

    expect(calledSchemaIds()).toContain(KILL_SCHEMA_ID);
    expect(llamaStatus.value).toStrictEqual({ running: false });
  });

  describe("when no user is logged in", () => {
    test("disallows cloud AI and ignores provider toggles", async () => {
      const apiSpy = mockCloudApi(true);
      const { isCloudAiAllowed, provider, toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await toggleProvider();

      expect(isCloudAiAllowed.value).toBe(false);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      expect(apiSpy).not.toHaveBeenCalled();
    });

    test("sends chat requests without an authorization header", async () => {
      useVeaseChat();

      await expect(lastTransportOptions(transportOptions).headers()).resolves.toStrictEqual({});
    });
  });
});
