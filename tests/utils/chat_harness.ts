import { type MockInstance, vi } from "vitest";
import type { UIMessage } from "ai";
import { ref } from "vue";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import { useChat } from "@ai-sdk/vue";

// The subset of the transport options the composable sets, with the
// Callback shapes it uses (the SDK types them as wider `Resolvable`s).
interface TransportOptions {
  api: string;
  headers: () => Promise<Record<string, string>>;
  body: () => object;
}

const STATUS_SCHEMA_ID = "api/llm/status";
const KILL_SCHEMA_ID = "api/llm/kill";
const ENTITLEMENT_SCHEMA_ID = "cloud_api/ai/entitlement";
const KEY_SCHEMA_ID = "cloud_api/ai/key";

const mockUser = { getIdToken: vi.fn<() => Promise<string>>().mockResolvedValue("token-123") };
type ApiRequest = ReturnType<typeof useAPIStore>["request"];

// Recreated for every test: composables built outside a component never stop
// Their watchers, so sharing these refs would wake up previous tests' instances.
const chatState = {
  userRef: ref<typeof mockUser | undefined>(undefined),
  chatStatus: ref<string>("ready"),
};
const appRequest = vi.fn<(args: { schema: { $id: string } }) => Promise<unknown>>();

function mockAuth(authenticated: boolean): void {
  chatState.userRef.value = authenticated ? mockUser : undefined;
  vi.mocked(useAuth).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full composable return type, established repo pattern.
    { user: chatState.userRef } as unknown as ReturnType<typeof useAuth>,
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

function lastTransportOptions(transportOptions: TransportOptions[]): TransportOptions {
  const options = transportOptions.at(-1);
  if (options === undefined) {
    throw new Error("No chat transport was created");
  }
  return options;
}

function calledSchemaIds(): string[] {
  return appRequest.mock.calls.map(([{ schema }]) => schema.$id);
}

// To call in beforeEach, after setupActivePinia(). Requires the test file to vi.mock the
// Auth composable, the app store and the useChat composable.
function resetChatMocks(transportOptions: TransportOptions[]): void {
  vi.clearAllMocks();
  transportOptions.length = 0;
  chatState.userRef = ref<typeof mockUser | undefined>(undefined);
  chatState.chatStatus = ref<string>("ready");
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
    status: chatState.chatStatus,
    error: ref<Error | undefined>(undefined),
    stop: vi.fn<() => void>(),
    clearError: vi.fn<() => void>(),
  };
  vi.mocked(useChat).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full composable return type, established repo pattern.
    useChatStub as unknown as ReturnType<typeof useChat>,
  );
}

export {
  type ApiRequest,
  ENTITLEMENT_SCHEMA_ID,
  KEY_SCHEMA_ID,
  KILL_SCHEMA_ID,
  STATUS_SCHEMA_ID,
  type TransportOptions,
  appRequest,
  calledSchemaIds,
  chatState,
  lastTransportOptions,
  mockAuth,
  mockCloudApi,
  resetChatMocks,
};
