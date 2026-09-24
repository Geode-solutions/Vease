import { assertDefined, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { connectToEventSource, connectToWebSocket } from "@vease/utils/events/index";
import {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
  getViewerClient,
} from "@vease/utils/external_stores";
import { Status } from "@ogw_front/utils/status";
import { flushPromises } from "@vue/test-utils";
import { importItem } from "@ogw_front/utils/import_workflow";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

const saveViewableFileId = opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id;
const visibilityId = opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility.$id;

interface EventSourceState {
  event: Ref<string | undefined>;
  data: Ref<string | undefined>;
  status: Ref<string>;
  error: Ref<unknown>;
}

// This runs before any import (including auto-imported `ref`), so the refs
// Are created lazily inside the vi.mock factory below and stored onto this
// Plain, hoisted holder that both the mock and the tests can access.
const eventSourceStateHolder = vi.hoisted((): { current: EventSourceState | undefined } => ({
  current: undefined,
}));

function getEventSourceState(): EventSourceState {
  return assertDefined(eventSourceStateHolder.current, "useEventSource mock was not initialized");
}

vi.mock(import("@vueuse/core"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("@vueuse/core")>();
  eventSourceStateHolder.current = {
    event: ref<string | undefined>(undefined),
    data: ref<string | undefined>(undefined),
    status: ref("CLOSED"),
    error: ref<unknown>(undefined),
  };
  return { ...actual, useEventSource: vi.fn<() => EventSourceState>(() => getEventSourceState()) };
});

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getViewerClient: vi.fn<typeof getViewerClient>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

type SubscribeFn = (eventName: string, onMessage: (args: unknown[]) => void) => void;

function mockSession(subscribe: SubscribeFn): void {
  // A stable session reference matters: it's what connectToWebSocket's
  // `session === subscribedSession` check relies on to avoid resubscribing.
  const session = { subscribe };
  vi.mocked(getViewerClient).mockReturnValue({
    getConnection: () => ({
      getSession: () => session,
    }),
  } as unknown as ReturnType<typeof getViewerClient>);
}

describe("events/index", () => {
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const setVisibilityMock = vi.fn<(id: string, visibility: boolean) => void>();

  beforeEach(() => {
    setupActivePinia();
    getEventSourceState().event.value = undefined;
    getEventSourceState().data.value = undefined;
    remoteRenderMock.mockClear();
    setVisibilityMock.mockClear();

    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost:5000",
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: remoteRenderMock,
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    vi.mocked(getDataStyleStore).mockReturnValue({
      setVisibility: setVisibilityMock,
    } as unknown as ReturnType<typeof getDataStyleStore>);
  });

  describe("connectToEventSource()", () => {
    test("does nothing when no event has been received yet", async () => {
      connectToEventSource();
      await flushPromises();

      expect(importItem).not.toHaveBeenCalled();
    });

    test("dispatches a matching event to its handler", async () => {
      const payload = { id: "item-1", viewer_type: "model", geode_object_type: "BRep" };
      getEventSourceState().event.value = saveViewableFileId;
      getEventSourceState().data.value = JSON.stringify(payload);

      connectToEventSource();
      await flushPromises();

      expect(importItem).toHaveBeenCalledWith(payload);
      expect(remoteRenderMock).toHaveBeenCalledWith();
    });

    test("re-dispatches when a new event arrives after connecting", async () => {
      connectToEventSource();
      await flushPromises();

      const payload = { id: "item-2", viewer_type: "model", geode_object_type: "BRep" };
      getEventSourceState().event.value = saveViewableFileId;
      getEventSourceState().data.value = JSON.stringify(payload);
      await flushPromises();

      expect(importItem).toHaveBeenCalledWith(payload);
    });

    test("logs and skips a malformed JSON payload instead of throwing", async () => {
      getEventSourceState().event.value = saveViewableFileId;
      getEventSourceState().data.value = "{not valid json";

      expect(() => {
        connectToEventSource();
      }).not.toThrow();
      await flushPromises();

      expect(importItem).not.toHaveBeenCalled();
    });
  });

  describe("connectToWebSocket()", () => {
    test("does not subscribe while the viewer is not connected", () => {
      const viewerStore = useViewerStore();
      viewerStore.status = Status.NOT_CONNECTED;
      const subscribe = vi.fn<SubscribeFn>();
      mockSession(subscribe);

      connectToWebSocket();

      expect(subscribe).not.toHaveBeenCalled();
    });

    test("subscribes to every viewer event once connected and dispatches visibility events", async () => {
      const viewerStore = useViewerStore();
      const handlers = new Map<string, (args: unknown[]) => void>();
      function subscribe(eventName: string, onMessage: (args: unknown[]) => void): void {
        handlers.set(eventName, onMessage);
      }
      mockSession(subscribe);

      connectToWebSocket();
      viewerStore.status = Status.CONNECTED;
      await flushPromises();

      expect(handlers.has(visibilityId)).toBe(true);

      handlers.get(visibilityId)?.([{ id: "mesh-1", visibility: true }]);

      expect(setVisibilityMock).toHaveBeenCalledWith("mesh-1", true);
    });

    test("does not resubscribe to the same session on repeated connected status", async () => {
      const viewerStore = useViewerStore();
      const subscribe = vi.fn<SubscribeFn>();
      mockSession(subscribe);

      connectToWebSocket();
      viewerStore.status = Status.CONNECTED;
      await flushPromises();
      const callCountAfterFirstConnect = subscribe.mock.calls.length;
      expect(callCountAfterFirstConnect).toBeGreaterThan(0);

      viewerStore.status = Status.NOT_CONNECTED;
      await flushPromises();
      viewerStore.status = Status.CONNECTED;
      await flushPromises();

      expect(subscribe).toHaveBeenCalledTimes(callCountAfterFirstConnect);
    });
  });
});
