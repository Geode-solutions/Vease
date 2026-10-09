import { assertDefined, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { connectToEventSource } from "@vease/utils/events/index";
import { flushPromises } from "@vue/test-utils";
import { importItem } from "@ogw_front/utils/import_workflow";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

vi.setConfig({ testTimeout: 10_000 });

const saveViewableFileId = opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id;

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
  const actual = await importOriginal();
  eventSourceStateHolder.current = {
    event: ref<string | undefined>(undefined),
    data: ref<string | undefined>(undefined),
    status: ref("CLOSED"),
    error: ref<unknown>(undefined),
  };
  const mocked = {
    ...actual,
    useEventSource: vi.fn<() => EventSourceState>(() => getEventSourceState()),
  };
  // `useEventSource`'s real signature is a generic overload set; the mock only
  // Implements the plain { event, data, status, error } shape this codebase reads.
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock can't reproduce useEventSource's full generic overload set
  return mocked as unknown as typeof actual;
});

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

describe("events/index", () => {
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();
    getEventSourceState().event.value = undefined;
    getEventSourceState().data.value = undefined;
    remoteRenderMock.mockClear();

    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost:5000",
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: remoteRenderMock,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof getHybridViewerStore>);
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
});
