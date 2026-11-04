import { type MockInstance, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { useViewerStore } from "@ogw_front/stores/viewer";

type ViewerStore = ReturnType<typeof useViewerStore>;

const createObjectSchema = { $id: "/test/create-object", methods: ["POST"] };

// Requires the test file to vi.mock("@vease/utils/external_stores"). The preview watcher
// Calls the real viewer store, which validates params against the JSON-RPC schema: it is
// Stubbed out and returned so assertions do not depend on every allowed schema value.
function stubCreateObjectStores(
  request: () => Promise<unknown>,
  remoteRender: () => Promise<void>,
): MockInstance<ViewerStore["request"]> {
  const backStoreStub = {
    base_url: "http://localhost",
    request,
  };
  vi.mocked(getBackStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
    backStoreStub as unknown as ReturnType<typeof getBackStore>,
  );
  const hybridViewerStoreStub = {
    remoteRender,
  };
  vi.mocked(getHybridViewerStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
    hybridViewerStoreStub as unknown as ReturnType<typeof getHybridViewerStore>,
  );
  return vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
}

export { createObjectSchema, stubCreateObjectStores };
