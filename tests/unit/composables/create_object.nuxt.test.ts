import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { setupActivePinia, withSetup } from "@vease_tests/utils";
import { flushPromises } from "@vue/test-utils";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useCreateObjectTool } from "@vease/composables/create_object";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const schema = { $id: "/test/create-object", methods: ["POST"] };

// The composable registers a window-level Escape listener via onKeyStroke.
// Leaving a test's instance mounted lets it observe (and potentially call
// StopImmediatePropagation on) later tests' Escape events, so every
// Instance created through mountTool is unmounted in afterEach.
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

describe("useCreateObjectTool composable", () => {
  beforeEach(() => {
    setupActivePinia();
    // The composable calls both getters eagerly at setup, even though none
    // Of the tests in this file exercise createObject() or the preview
    // Watcher, so a minimal stub is enough here.
    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost",
      request: vi.fn<() => Promise<unknown>>(),
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: vi.fn<() => Promise<void>>(),
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  afterEach(() => {
    for (const tool of mountedTools) {
      tool.unmount();
    }
    mountedTools = [];
    vi.restoreAllMocks();
  });

  describe("points management", () => {
    test("starts with minPoints empty points and a generated name", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      expect(result.points.value).toHaveLength(2);
      expect(result.points.value.every((point) => point.x === "")).toBe(true);
      expect(result.name.value).toBe("Curve");
    });

    test("addPoint appends an empty point", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.addPoint();
      expect(result.points.value).toHaveLength(3);
    });

    test("removePoint removes a point above minPoints", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.addPoint();
      result.removePoint(0);
      expect(result.points.value).toHaveLength(2);
    });

    test("removePoint is a no-op at minPoints", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.removePoint(0);
      expect(result.points.value).toHaveLength(2);
    });
  });

  describe("valid points computed properties", () => {
    test("only counts fully filled points as valid", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      expect(result.validPointCount.value).toBe(1);
      expect(result.hasValidPoints.value).toBe(false);

      result.points.value[1] = { x: 4, y: 5, z: 6 };
      expect(result.validPointCount.value).toBe(2);
      expect(result.hasValidPoints.value).toBe(true);
    });
  });

  describe("togglePickMode", () => {
    test("toggles pickingActive and forwards to the viewer store", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");

      result.togglePickMode();
      expect(result.pickingActive.value).toBe(true);
      expect(toggleSpy).toHaveBeenCalledWith(true);

      result.togglePickMode();
      expect(result.pickingActive.value).toBe(false);
      expect(toggleSpy).toHaveBeenCalledWith(false);
    });
  });

  describe("handleClose", () => {
    test("resets name, points, stops picking, hides tools and calls onReset", () => {
      const onReset = vi.fn<() => void>();
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema, onReset }),
      );
      const uiStore = useUIStore();
      uiStore.setShowCreateTools(true);
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");

      result.addPoint();
      result.points.value[0] = { x: 1, y: 2, z: 3 };
      result.togglePickMode();

      result.handleClose();

      expect(result.points.value).toHaveLength(2);
      expect(result.points.value.every((point) => point.x === "")).toBe(true);
      expect(toggleSpy).toHaveBeenLastCalledWith(false);
      expect(onReset).toHaveBeenCalledWith();
      expect(uiStore.showCreateTools).toBe(false);
    });

    test("does not toggle picking mode when it was already inactive", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      const toggleSpy = vi.spyOn(viewerStore, "toggle_picking_mode");

      result.handleClose();

      expect(toggleSpy).not.toHaveBeenCalled();
    });
  });

  describe("picked_point watcher", () => {
    test("ignores picked points while picking mode is inactive", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();

      viewerStore.picked_point = { x: 1, y: 2, z: 3 };
      await flushPromises();

      expect(result.points.value.every((point) => point.x === "")).toBe(true);
    });

    test("fills the first empty point while picking", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      result.togglePickMode();

      viewerStore.picked_point = { x: "1,5", y: 2, z: 3 };
      await flushPromises();

      expect(result.points.value[0]).toStrictEqual({ x: 1.5, y: 2, z: 3 });
      expect(result.points.value[1]).toStrictEqual({ x: "", y: "", z: "" });
    });

    test("pushes a new point once existing points are full", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      result.points.value[0] = { x: 1, y: 1, z: 1 };
      result.points.value[1] = { x: 2, y: 2, z: 2 };
      result.togglePickMode();

      viewerStore.picked_point = { x: 3, y: 3, z: 3 };
      await flushPromises();

      expect(result.points.value).toHaveLength(3);
      expect(result.points.value[2]).toStrictEqual({ x: 3, y: 3, z: 3 });
    });

    test("skips filling a point when onPickedPoint handles it and returns true", async () => {
      const onPickedPoint = vi
        .fn<(point: { x: number; y: number; z: number }, points: unknown[]) => boolean>()
        .mockReturnValue(true);
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema, onPickedPoint }),
      );
      const viewerStore = useViewerStore();
      result.togglePickMode();

      viewerStore.picked_point = { x: 1, y: 2, z: 3 };
      await flushPromises();

      expect(onPickedPoint).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, result.points.value);
      expect(result.points.value.every((point) => point.x === "")).toBe(true);
    });

    test("ignores incomplete picked points", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();
      result.togglePickMode();

      viewerStore.picked_point = { x: undefined, y: undefined, z: undefined };
      await flushPromises();

      expect(result.points.value.every((point) => point.x === "")).toBe(true);
    });
  });

  describe("picking_mode watcher", () => {
    test("syncs pickingActive when the viewer store changes picking_mode externally", async () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const viewerStore = useViewerStore();

      viewerStore.picking_mode = true;
      await flushPromises();

      expect(result.pickingActive.value).toBe(true);
    });
  });
});
