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
      const { isCloudAiAllowed, provider, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await setProvider(CHAT_PROVIDER.GATEWAY);

      expect(isCloudAiAllowed.value).toBe(false);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
    });

    test("explains when the account is not entitled to cloud AI", async () => {
      const { cloudUnavailableReason, CLOUD_UNAVAILABLE_REASON } = useVeaseChat();
      await flushPromises();

      expect(cloudUnavailableReason.value).toBe(CLOUD_UNAVAILABLE_REASON.NOT_ENTITLED);
    });

    test("has no cloud unavailability reason for an entitled account", async () => {
      mockCloudApi(true);
      const { cloudUnavailableReason } = useVeaseChat();
      await flushPromises();

      expect(cloudUnavailableReason.value).toBeUndefined();
    });

    test("keeps the provider and reports an error when the gateway key cannot be fetched", async () => {
      const apiSpy = mockCloudApi(true);
      const { provider, providerError, isSwitchingProvider, setProvider, CHAT_PROVIDER } =
        useVeaseChat();
      await flushPromises();
      apiSpy.mockRejectedValueOnce(new Error("network down"));

      await setProvider(CHAT_PROVIDER.GATEWAY);

      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      expect(providerError.value).toBeTypeOf("string");
      expect(isSwitchingProvider.value).toBe(false);
    });

    test("marks where the conversation continues with another provider", async () => {
      mockCloudApi(true);
      const { providerSwitches, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await setProvider(CHAT_PROVIDER.GATEWAY);
      expect(providerSwitches.value).toStrictEqual([]);

      chatState.chatMessages.value = [
        { id: "user-1", role: "user", parts: [{ type: "text", text: "Hi" }] },
        { id: "assistant-1", role: "assistant", parts: [{ type: "text", text: "Hello" }] },
      ];
      await setProvider(CHAT_PROVIDER.LLAMA);

      expect(providerSwitches.value).toStrictEqual([
        { afterMessageCount: 2, provider: CHAT_PROVIDER.LLAMA },
      ]);
    });

    test("ignores provider switches while an answer is in progress", async () => {
      mockCloudApi(true);
      const { provider, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      chatState.chatStatus.value = "streaming";

      await setProvider(CHAT_PROVIDER.GATEWAY);

      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
    });

    test("allows switching provider after a failed answer", async () => {
      mockCloudApi(true);
      const { provider, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      chatState.chatStatus.value = "error";

      await setProvider(CHAT_PROVIDER.GATEWAY);

      expect(provider.value).toBe(CHAT_PROVIDER.GATEWAY);
    });

    test("sends chat requests with a bearer token", async () => {
      useVeaseChat();

      await expect(lastTransportOptions(transportOptions).headers()).resolves.toStrictEqual({
        Authorization: "Bearer token-123",
      });
    });

    test("sends the selected provider and its gateway key with each chat request", async () => {
      mockCloudApi(true);
      const { setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      const { body } = lastTransportOptions(transportOptions);

      expect(body()).toStrictEqual({ provider: CHAT_PROVIDER.LLAMA, gatewayApiKey: undefined });

      await setProvider(CHAT_PROVIDER.GATEWAY);

      expect(body()).toStrictEqual({
        provider: CHAT_PROVIDER.GATEWAY,
        gatewayApiKey: "gateway-key",
      });
    });

    test("switches between providers, fetching the gateway key only once", async () => {
      const apiSpy = mockCloudApi(true);
      const { provider, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();

      await setProvider(CHAT_PROVIDER.GATEWAY);
      expect(provider.value).toBe(CHAT_PROVIDER.GATEWAY);
      await setProvider(CHAT_PROVIDER.LLAMA);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      await setProvider(CHAT_PROVIDER.GATEWAY);
      expect(provider.value).toBe(CHAT_PROVIDER.GATEWAY);

      const keyRequests = apiSpy.mock.calls.filter(([{ schema }]) => schema.$id === KEY_SCHEMA_ID);
      expect(keyRequests).toHaveLength(1);
    });

    test("does not refresh the local model status after a gateway answer", async () => {
      mockCloudApi(true);
      const { setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      await setProvider(CHAT_PROVIDER.GATEWAY);
      appRequest.mockClear();

      chatState.chatStatus.value = "streaming";
      await flushPromises();
      chatState.chatStatus.value = "ready";
      await flushPromises();

      expect(appRequest).not.toHaveBeenCalled();
    });

    test("falls back to the local provider and forgets the gateway key on logout", async () => {
      mockCloudApi(true);
      const { isCloudAiAllowed, provider, setProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      await setProvider(CHAT_PROVIDER.GATEWAY);

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
