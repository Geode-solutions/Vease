import { type MockInstance, afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createToolMounter, setupActivePinia, withSetup } from "@vease_tests/utils";
import type { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import {
  createObjectSchema as schema,
  stubCreateObjectStores,
} from "@vease_tests/utils/create_object_stubs";
import { flushPromises } from "@vue/test-utils";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useCreateObjectTool } from "@vease/composables/create_object";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

// Same window-Escape-listener leak concern as create_object.nuxt.test.ts:
// See createToolMounter()'s comment in tests/utils.ts for details.
const { mountTool, unmountAll } = createToolMounter();

type ViewerStore = ReturnType<typeof useViewerStore>;

describe("useCreateObjectTool composable interactions", () => {
  const requestMock = vi.fn<() => Promise<{ id: string }>>().mockResolvedValue({ id: "created" });
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  let viewerRequestMock: MockInstance<ViewerStore["request"]> = vi.fn<ViewerStore["request"]>();

  beforeEach(() => {
    setupActivePinia();
    requestMock.mockClear();
    remoteRenderMock.mockClear();
    // The preview watcher calls the real viewer store, which validates params
    // Against the JSON-RPC schema; stub it out so preview assertions don't
    // Depend on knowing every allowed schema value.
    viewerRequestMock = stubCreateObjectStores(requestMock, remoteRenderMock);
  });

  afterEach(() => {
    unmountAll();
  });

  describe("createObject", () => {
    test("does nothing when there are not enough valid points", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );

      await result.createObject();

      expect(requestMock).not.toHaveBeenCalled();
    });

    test("submits valid points, imports the result and re-renders", async () => {
      const getAdditionalPayload = vi
        .fn<(points: unknown[]) => Record<string, unknown>>()
        .mockReturnValue({ extra: true });
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema, getAdditionalPayload }),
      );
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      result.points.value[1] = { x: 4, y: 5, z: 6 };

      await result.createObject();

      expect(requestMock).toHaveBeenCalledWith({
        schema,
        params: {
          name: "Curve",
          points: [
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
          ],
          extra: true,
        },
      });
      expect(importItem).toHaveBeenCalledWith({ id: "created" });
      expect(remoteRenderMock).toHaveBeenCalledWith();
      // The composable resets the points to empty right after this call.
      expect(result.points.value.every((point) => point.x === "")).toBe(true);
    });

    test("resets loading state even if the request fails", async () => {
      requestMock.mockRejectedValueOnce(new Error("boom"));
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      result.points.value[1] = { x: 4, y: 5, z: 6 };

      await expect(result.createObject()).rejects.toThrow("boom");

      expect(result.loading.value).toBe(false);
    });
  });

  describe("preview requests", () => {
    test("requests a preview immediately and on point changes when previewStyle is set", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({
          namePrefix: "Curve",
          minPoints: 1,
          schema,
          previewStyle: "curve",
          getPreviewParams: () => ({ color: "red" }),
        }),
      );
      await flushPromises();

      expect(viewerRequestMock).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { points: [], style: "curve", color: "red" },
        }),
      );

      viewerRequestMock.mockClear();
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      await flushPromises();

      expect(viewerRequestMock).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { points: [{ x: 1, y: 2, z: 3 }], style: "curve", color: "red" },
        }),
      );
    });

    test("does not request a preview when previewStyle is not set", async () => {
      mountTool(() => useCreateObjectTool({ namePrefix: "Curve", minPoints: 1, schema }));
      await flushPromises();

      expect(viewerRequestMock).not.toHaveBeenCalled();
    });
  });

  describe("unmount cleanup", () => {
    test("stops picking mode and clears the preview on unmount", async () => {
      const { result, unmount } = withSetup(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 1, schema, previewStyle: "curve" }),
      );
      await flushPromises();
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");
      result.togglePickMode();
      viewerRequestMock.mockClear();

      unmount();
      await flushPromises();

      expect(toggleSpy).toHaveBeenCalledWith(false);
      expect(viewerRequestMock).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { points: [], style: "curve" },
        }),
      );
    });
  });
});
