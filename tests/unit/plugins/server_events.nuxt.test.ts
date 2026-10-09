import { beforeEach, describe, expect, test, vi } from "vitest";
import { connectToEventSource } from "@vease/utils/events/index";
import { createTestingPinia } from "@pinia/testing";
import serverEventsPlugin from "@vease/plugins/server_events.client";
import { setActivePinia } from "pinia";
import { setBackBaseUrl } from "@ogw_shared/scripts";
import { useAppStore } from "@ogw_front/stores/app";
import { useBackStore } from "@ogw_front/stores/back";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_shared/scripts"), async (importOriginal) => ({
  ...(await importOriginal()),
  setBackBaseUrl: vi.fn<typeof setBackBaseUrl>().mockResolvedValue(undefined),
}));

vi.mock(import("@vease/utils/events/index"), () => ({
  connectToEventSource: vi.fn<typeof connectToEventSource>(),
}));

// `connect` is what every mode calls once the microservices exist; in cloud
// Mode it is the only one, since the microservices are never launched.
describe("server_events plugin", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Keep the real `connect` actions so their $onAction hooks fire, but
    // Stub the back ping so nothing reaches the network.
    setActivePinia(
      createTestingPinia({ stubActions: (action) => action === "set_ping", createSpy: vi.fn }),
    );
    await serverEventsPlugin(useNuxtApp());
  });

  test("connecting the back sends its URL to the server and listens to its events", async () => {
    const backStore = useBackStore();
    await backStore.connect();

    expect(setBackBaseUrl).toHaveBeenCalledWith(useAppStore().base_url, backStore.base_url);
    await vi.waitFor(() => {
      expect(connectToEventSource).toHaveBeenCalledWith();
    });
  });
});
