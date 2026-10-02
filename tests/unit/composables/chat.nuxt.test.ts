import { DefaultChatTransport, type UIMessage } from "ai";
import { type MockInstance, beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { setupActivePinia } from "@vease_tests/utils";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import { useChat } from "@ai-sdk/vue";
import { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

// The subset of the transport options the composable sets, with the
// Callback shapes it uses (the SDK types them as wider `Resolvable`s).
interface TransportOptions {
  api: string;
  headers: () => Promise<Record<string, string>>;
  body: () => object;
}

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

const STATUS_SCHEMA_ID = "api/llm/status";
const KILL_SCHEMA_ID = "api/llm/kill";
const ENTITLEMENT_SCHEMA_ID = "cloud_api/ai/entitlement";
const KEY_SCHEMA_ID = "cloud_api/ai/key";

const mockUser = { getIdToken: vi.fn<() => Promise<string>>().mockResolvedValue("token-123") };
type ApiRequest = ReturnType<typeof useAPIStore>["request"];

// Recreated for every test: composables built outside a component never stop
// Their watchers, so sharing these refs would wake up previous tests' instances.
let userRef = ref<typeof mockUser | undefined>(undefined);
let chatStatus = ref<string>("ready");
const appRequest = vi.fn<(args: { schema: { $id: string } }) => Promise<unknown>>();

function mockAuth(authenticated: boolean): void {
  userRef.value = authenticated ? mockUser : undefined;
  vi.mocked(useAuth).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full composable return type, established repo pattern.
    { user: userRef } as unknown as ReturnType<typeof useAuth>,
  );
}

function mockCloudApi(cloudAllowed: boolean): MockInstance<ApiRequest> {
  const responseBySchemaId = new Map<string, unknown>([
    [ENTITLEMENT_SCHEMA_ID, { cloudAllowed }],
    [KEY_SCHEMA_ID, { apiKeyString: "gateway-key" }],
  ]);
  const apiStore = useAPIStore();
  return vi
    .spyOn(apiStore, "request")
    .mockImplementation(async ({ schema }: { schema: { $id: string } }) => {
      await Promise.resolve();
      return responseBySchemaId.get(schema.$id);
    });
}

function lastTransportOptions(): TransportOptions {
  const options = transportOptions.at(-1);
  if (options === undefined) {
    throw new Error("No chat transport was created");
  }
  return options;
}

function calledSchemaIds(): string[] {
  return appRequest.mock.calls.map(([{ schema }]) => schema.$id);
}

describe("the useVeaseChat composable", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.clearAllMocks();
    transportOptions.length = 0;
    userRef = ref<typeof mockUser | undefined>(undefined);
    chatStatus = ref<string>("ready");
    mockAuth(false);
    appRequest.mockImplementation(async ({ schema }) => {
      await Promise.resolve();
      return schema.$id === STATUS_SCHEMA_ID ? { statusCode: 200, running: true } : {};
    });
    vi.mocked(useAppStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
      { request: appRequest } as unknown as ReturnType<typeof useAppStore>,
    );
    const useChatStub = {
      messages: ref<UIMessage[]>([]),
      sendMessage: vi.fn<() => void>(),
      status: chatStatus,
      error: ref<Error | undefined>(undefined),
      stop: vi.fn<() => void>(),
      clearError: vi.fn<() => void>(),
    };
    vi.mocked(useChat).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full composable return type, established repo pattern.
      useChatStub as unknown as ReturnType<typeof useChat>,
    );
  });

  test("initializes useChat with a transport targeting the /api/llm/chat endpoint", () => {
    const chat = useVeaseChat();

    // oxlint-disable-next-line no-unsafe-type-assertion -- expect.any() is typed as `any`; this matcher genuinely satisfies DefaultChatTransport at runtime.
    const anyTransport = expect.any(DefaultChatTransport) as DefaultChatTransport<UIMessage>;
    expect(useChat).toHaveBeenCalledWith({ transport: anyTransport });
    expect(lastTransportOptions().api).toBe("/api/llm/chat");
    expect(chat.messages.value).toStrictEqual([]);
    expect(chat.status.value).toBe("ready");
    expect(chat.provider.value).toBe(chat.CHAT_PROVIDER.LLAMA);
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

    chatStatus.value = "streaming";
    await flushPromises();
    chatStatus.value = "ready";
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

      await expect(lastTransportOptions().headers()).resolves.toStrictEqual({});
    });
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

      await expect(lastTransportOptions().headers()).resolves.toStrictEqual({
        Authorization: "Bearer token-123",
      });
    });

    test("sends the selected provider and its gateway key with each chat request", async () => {
      mockCloudApi(true);
      const { toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      const { body } = lastTransportOptions();

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

      chatStatus.value = "streaming";
      await flushPromises();
      chatStatus.value = "ready";
      await flushPromises();

      expect(appRequest).not.toHaveBeenCalled();
    });

    test("falls back to the local provider and forgets the gateway key on logout", async () => {
      mockCloudApi(true);
      const { isCloudAiAllowed, provider, toggleProvider, CHAT_PROVIDER } = useVeaseChat();
      await flushPromises();
      await toggleProvider();

      userRef.value = undefined;
      await flushPromises();

      expect(isCloudAiAllowed.value).toBe(false);
      expect(provider.value).toBe(CHAT_PROVIDER.LLAMA);
      expect(lastTransportOptions().body()).toStrictEqual({
        provider: CHAT_PROVIDER.LLAMA,
        gatewayApiKey: undefined,
      });
    });
  });
});
