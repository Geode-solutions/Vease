import { type MockInstance, afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { setupActivePinia, withSetup } from "@vease_tests/utils";
import { flushPromises } from "@vue/test-utils";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useCreateObjectTool } from "@vease/composables/create_object";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const schema = { $id: "/test/create-object", methods: ["POST"] };
const OUT_OF_RANGE_INDEX = 5;

// Same window-Escape-listener leak concern as create_object.nuxt.test.ts:
// See that file's comment for details.
interface MountedTool {
  unmount: () => void;
}
let mountedTools: MountedTool[] = [];

function mountTool<TValue>(composable: () => TValue): { result: TValue; unmount: () => void } {
  const handle = withSetup(composable);
  let unmounted = false;
  const tracked: MountedTool = {
    unmount: () => {
      if (unmounted) {
        return;
      }
      unmounted = true;
      handle.unmount();
    },
  };
  mountedTools.push(tracked);
  return { result: handle.result, unmount: tracked.unmount };
}

function makePasteEvent(text: string): ClipboardEvent {
  return {
    clipboardData: { getData: () => text },
    preventDefault: vi.fn<() => void>(),
  } as unknown as ClipboardEvent;
}

describe("useCreateObjectTool composable interactions", () => {
  const requestMock = vi.fn<() => Promise<{ id: string }>>().mockResolvedValue({ id: "created" });
  const remoteRenderMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  let viewerRequestMock: MockInstance<(...args: unknown[]) => unknown> =
    vi.fn<(...args: unknown[]) => unknown>();

  beforeEach(() => {
    setupActivePinia();
    requestMock.mockClear();
    remoteRenderMock.mockClear();
    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost",
      request: requestMock,
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: remoteRenderMock,
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    // The preview watcher calls the real viewer store, which validates params
    // Against the JSON-RPC schema; stub it out so preview assertions don't
    // Depend on knowing every allowed schema value.
    viewerRequestMock = vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  afterEach(() => {
    for (const tool of mountedTools) {
      tool.unmount();
    }
    mountedTools = [];
    vi.restoreAllMocks();
  });

  describe("escape key handling", () => {
    test("stops picking mode on Escape while picking is active", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");
      result.togglePickMode();
      toggleSpy.mockClear();

      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await flushPromises();

      expect(toggleSpy).toHaveBeenCalledWith(false);
    });

    test("does nothing on Escape while not picking", async () => {
      mountTool(() => useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }));
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");

      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await flushPromises();

      expect(toggleSpy).not.toHaveBeenCalled();
    });
  });

  describe("sanitizeInput", () => {
    test("strips non-numeric characters and normalizes commas to dots", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.sanitizeInput("12,5abc", 0, "x");
      expect(result.points.value[0]?.x).toBe("12.5");
    });

    test("collapses a value with more than one exponent marker", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.sanitizeInput("1e2e3", 0, "x");
      expect(result.points.value[0]?.x).toBe("1e2");
    });

    test("is a no-op for an out-of-range index", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      expect(() => result.sanitizeInput("1", OUT_OF_RANGE_INDEX, "x")).not.toThrow();
    });
  });

  describe("handlePaste", () => {
    test("fills x, y, z from three pasted numbers", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const event = makePasteEvent("1.5 2.5 3.5");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "1.5", y: "2.5", z: "3.5" });
      expect(event.preventDefault).toHaveBeenCalledWith();
    });

    test("defaults z to 0 when only two numbers are pasted", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const event = makePasteEvent("1.5, 2.5");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "1.5", y: "2.5", z: "0" });
    });

    test("fills only the target field when a single number is pasted", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const event = makePasteEvent("42");

      result.handlePaste(event, 0, "z");

      expect(result.points.value[0]).toStrictEqual({ x: "", y: "", z: "42" });
    });

    test("does nothing when the clipboard has no numbers", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const event = makePasteEvent("not a number");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "", y: "", z: "" });
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
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
          previewStyle: "dashed",
          getPreviewParams: () => ({ color: "red" }),
        }),
      );
      await flushPromises();

      expect(viewerRequestMock).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ points: [], style: "dashed", color: "red" }),
        }),
      );

      viewerRequestMock.mockClear();
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      await flushPromises();

      expect(viewerRequestMock).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            points: [{ x: 1, y: 2, z: 3 }],
            style: "dashed",
            color: "red",
          }),
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
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 1, schema, previewStyle: "dashed" }),
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
          params: expect.objectContaining({ points: [], style: "dashed" }),
        }),
      );
    });
  });
});
