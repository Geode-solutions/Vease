import { beforeEach, describe, expect, test, vi } from "vitest";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import { viewerEventHandlers } from "@vease/utils/events/viewer";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const visibilityId = opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility.$id;
const renderId = opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render.$id;
const NOT_A_REAL_PAYLOAD: unknown = JSON.parse("null");

describe("the viewerEventHandlers map", () => {
  const setVisibilityMock = vi.fn<(id: string, visibility: boolean) => void>();
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    setVisibilityMock.mockClear();
    remoteRenderMock.mockClear();
    vi.mocked(getDataStyleStore).mockReturnValue({
      setVisibility: setVisibilityMock,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof getDataStyleStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: remoteRenderMock,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof getHybridViewerStore>);
  });

  test("registers handlers for mesh points visibility and viewer render", () => {
    expect(Object.keys(viewerEventHandlers).toSorted()).toStrictEqual(
      [visibilityId, renderId].toSorted(),
    );
  });

  describe("mesh points visibility handler", () => {
    test("forwards a valid payload to the data style store", () => {
      viewerEventHandlers[visibilityId]?.({ id: "mesh-1", visibility: false });

      expect(setVisibilityMock).toHaveBeenCalledWith("mesh-1", false);
    });

    test("ignores a payload with the wrong shape", () => {
      viewerEventHandlers[visibilityId]?.({ id: "mesh-1", visibility: "not-a-boolean" });
      viewerEventHandlers[visibilityId]?.(NOT_A_REAL_PAYLOAD);

      expect(setVisibilityMock).not.toHaveBeenCalled();
    });
  });

  describe("viewer render handler", () => {
    test("triggers a remote render", () => {
      viewerEventHandlers[renderId]?.(undefined);

      expect(remoteRenderMock).toHaveBeenCalledWith();
    });
  });
});
