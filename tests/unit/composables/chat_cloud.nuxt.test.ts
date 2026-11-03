import {
  type ApiRequest,
  ENTITLEMENT_SCHEMA_ID,
  KEY_SCHEMA_ID,
  type TransportOptions,
  appRequest,
  chatState,
  lastTransportOptions,
  mockAuth,
  mockCloudApi,
  resetChatMocks,
} from "@vease_tests/utils/chat_harness";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { UIMessage } from "ai";
import { flushPromises } from "@vue/test-utils";
import { setupActivePinia } from "@vease_tests/utils";
import type { useAppStore } from "@ogw_front/stores/app";
import type { useAuth } from "@vease/composables/auth";
import type { useChat } from "@ai-sdk/vue";
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

describe("the useVeaseChat composable with a logged in user", () => {
  beforeEach(() => {
    setupActivePinia();
    resetChatMocks(transportOptions);
  });

  describe("when a user is logged in", () => {
    beforeEach(() => {
      mockAuth(true);
      mockCloudApi(false);
    });

    test("checks the cloud AI entitlement with a bearer token", async () => {
      const apiSpy = mockCloudApi(true);
      const { isCloudAiAllowed } = useVeaseChat();
      await flushPromises();

      /* oxlint-disable no-unsafe-type-assertion -- expect.objectContaining is typed as `any`; this matcher genuinely satisfies the request schema type at runtime. */
      const entitlementSchema = expect.objectContaining({
        $id: ENTITLEMENT_SCHEMA_ID,
      }) as Parameters<ApiRequest>[0]["schema"];
      /* oxlint-enable no-unsafe-type-assertion */
      expect(apiSpy).toHaveBeenCalledWith({
        schema: entitlementSchema,
        headers: { Authorization: "Bearer token-123" },
      });
      expect(isCloudAiAllowed.value).toBe(true);
    });

    test("keeps the local provider when the account is not entitled to cloud AI", async () => {
      mockCloudApi(false);
      const { isCloudAiAllowed, provider, toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await toggleProvider();

      expect(isCloudAiAllowed.value).toBe(false);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
    });

    test("sends chat requests with a bearer token", async () => {
      useVeaseChat();

      await expect(lastTransportOptions(transportOptions).headers()).resolves.toStrictEqual({
        Authorization: "Bearer token-123",
      });
    });

    test("sends the selected provider and its gateway key with each chat request", async () => {
      mockCloudApi(true);
      const { toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      const { body } = lastTransportOptions(transportOptions);

      expect(body()).toStrictEqual({ provider: CHAT_PROVIDER.LLAMA, gatewayApiKey: undefined });

      await toggleProvider();

      expect(body()).toStrictEqual({
        provider: CHAT_PROVIDER.GATEWAY,
        gatewayApiKey: "gateway-key",
      });
    });

    test("toggles between providers, fetching the gateway key only once", async () => {
      const apiSpy = mockCloudApi(true);
      const { provider, toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await toggleProvider();
      expect(provider.value).toBe(CHAT_PROVIDER.GATEWAY);
      await toggleProvider();
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      await toggleProvider();
      expect(provider.value).toBe(CHAT_PROVIDER.GATEWAY);

      const keyRequests = apiSpy.mock.calls.filter(([{ schema }]) => schema.$id === KEY_SCHEMA_ID);
      expect(keyRequests).toHaveLength(1);
    });

    test("does not refresh the local model status after a gateway answer", async () => {
      mockCloudApi(true);
      const { toggleProvider } = useVeaseChat();
      await flushPromises();
      await toggleProvider();
      appRequest.mockClear();

      chatState.chatStatus.value = "streaming";
      await flushPromises();
      chatState.chatStatus.value = "ready";
      await flushPromises();

      expect(appRequest).not.toHaveBeenCalled();
    });

    test("falls back to the local provider and forgets the gateway key on logout", async () => {
      mockCloudApi(true);
      const { isCloudAiAllowed, provider, toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      await toggleProvider();

      chatState.userRef.value = undefined;
      await flushPromises();

      expect(isCloudAiAllowed.value).toBe(false);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      expect(lastTransportOptions(transportOptions).body()).toStrictEqual({
        provider: CHAT_PROVIDER.LLAMA,
        gatewayApiKey: undefined,
      });
    });
  });
});
