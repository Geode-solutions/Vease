import { beforeEach, describe, expect, test, vi } from "vitest";
import { backEventHandlers } from "@vease/utils/events/back";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { waitForImport } from "@vease/utils/controller/pending_imports";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const saveViewableFileId = opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id;
const NOT_A_REAL_PAYLOAD: unknown = JSON.parse("null");
const TIMEOUT_MS = 1000;
const ONCE = 1;

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
    const item = {
      id: "item-1",
      viewer_type: "model",
      geode_object_type: "BRep",
    };

    await backEventHandlers[saveViewableFileId]?.({ data: [item] });

    expect(importItem).toHaveBeenCalledWith(item);
    expect(remoteRenderMock).toHaveBeenCalledWith();
  });

  test("imports every object of a multi-object payload", async () => {
    const first = { id: "item-a", viewer_type: "mesh", geode_object_type: "TriangulatedSurface3D" };
    const second = {
      id: "item-b",
      viewer_type: "mesh",
      geode_object_type: "TriangulatedSurface3D",
    };

    const handled = backEventHandlers[saveViewableFileId]?.({ data: [first, second] });
    await Promise.all([waitForImport("item-a", TIMEOUT_MS), waitForImport("item-b", TIMEOUT_MS)]);
    await handled;

    expect(importItem).toHaveBeenCalledWith(first);
    expect(importItem).toHaveBeenCalledWith(second);
  });

  test("renders once after every object of a multi-object payload is imported", async () => {
    const first = { id: "item-c", viewer_type: "mesh", geode_object_type: "TriangulatedSurface3D" };
    const second = {
      id: "item-d",
      viewer_type: "mesh",
      geode_object_type: "TriangulatedSurface3D",
    };

    const handled = backEventHandlers[saveViewableFileId]?.({ data: [first, second] });
    // Each tracked import is ready once the single final render is done
    await waitForImport("item-c", TIMEOUT_MS);
    expect(remoteRenderMock).toHaveBeenCalledTimes(ONCE);
    await handled;

    expect(remoteRenderMock).toHaveBeenCalledTimes(ONCE);
    const lastImportOrder = Math.max(...vi.mocked(importItem).mock.invocationCallOrder);
    const [renderOrder] = remoteRenderMock.mock.invocationCallOrder;
    expect(renderOrder).toBeGreaterThan(lastImportOrder);
  });

  test("lets the controller wait for the import and the render", async () => {
    const item = { id: "item-2", viewer_type: "mesh", geode_object_type: "PointSet3D" };

    const handled = backEventHandlers[saveViewableFileId]?.({ data: [item] });
    await waitForImport("item-2", TIMEOUT_MS);

    expect(remoteRenderMock).toHaveBeenCalledWith();
    await handled;
  });

  test("ignores a payload with an item missing required fields", async () => {
    await backEventHandlers[saveViewableFileId]?.({ data: [{ id: "item-1" }] });

    expect(importItem).not.toHaveBeenCalled();
    expect(remoteRenderMock).not.toHaveBeenCalled();
  });

  test("ignores a payload without data list", async () => {
    await backEventHandlers[saveViewableFileId]?.({
      id: "item-1",
      viewer_type: "model",
      geode_object_type: "BRep",
    });
    await backEventHandlers[saveViewableFileId]?.({ data: [] });

    expect(importItem).not.toHaveBeenCalled();
  });

  test("ignores a non-object payload", async () => {
    await backEventHandlers[saveViewableFileId]?.(NOT_A_REAL_PAYLOAD);
    await backEventHandlers[saveViewableFileId]?.("not an object");

    expect(importItem).not.toHaveBeenCalled();
  });
});
