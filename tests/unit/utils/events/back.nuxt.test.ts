import { beforeEach, describe, expect, test, vi } from "vitest";
import { backEventHandlers } from "@vease/utils/events/back";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const saveViewableFileId = opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id;
const NOT_A_REAL_PAYLOAD: unknown = JSON.parse("null");

describe("the backEventHandlers map", () => {
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    remoteRenderMock.mockClear();
    vi.mocked(getHybridViewerStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial Pinia store, see tests/unit/server/utils/data_file.nuxt.test.ts
      { remoteRender: remoteRenderMock } as unknown as ReturnType<typeof getHybridViewerStore>,
    );
  });

  test("registers exactly one handler, for save_viewable_file", () => {
    expect(Object.keys(backEventHandlers)).toStrictEqual([saveViewableFileId]);
  });

  test("imports a valid payload and re-renders", async () => {
    const payload = {
      id: "item-1",
      viewer_type: "model",
      geode_object_type: "BRep",
    };

    await backEventHandlers[saveViewableFileId]?.(payload);

    expect(importItem).toHaveBeenCalledWith(payload);
    expect(remoteRenderMock).toHaveBeenCalledWith();
  });

  test("ignores a payload missing required fields", async () => {
    await backEventHandlers[saveViewableFileId]?.({ id: "item-1" });

    expect(importItem).not.toHaveBeenCalled();
    expect(remoteRenderMock).not.toHaveBeenCalled();
  });

  test("ignores a non-object payload", async () => {
    await backEventHandlers[saveViewableFileId]?.(NOT_A_REAL_PAYLOAD);
    await backEventHandlers[saveViewableFileId]?.("not an object");

    expect(importItem).not.toHaveBeenCalled();
  });
});
