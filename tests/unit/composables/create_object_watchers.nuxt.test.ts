import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createToolMounter, setupActivePinia } from "@vease_tests/utils";
import type { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import {
  createObjectSchema as schema,
  stubCreateObjectStores,
} from "@vease_tests/utils/create_object_stubs";
import { flushPromises } from "@vue/test-utils";
import type { importItem } from "@ogw_front/utils/import_workflow";
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

// The composable registers a window-level Escape listener via onKeyStroke.
// Leaving a test's instance mounted lets it observe (and potentially call
// StopImmediatePropagation on) later tests' Escape events, so every
// Instance created through mountTool is unmounted in afterEach. See
// CreateToolMounter()'s comment in tests/utils.ts for details.
const { mountTool, unmountAll } = createToolMounter();

describe("useCreateObjectTool composable", () => {
  beforeEach(() => {
    setupActivePinia();
    // The composable calls both getters eagerly at setup, even though none
    // Of the tests in this file exercise createObject() or the preview
    // Watcher, so a minimal stub is enough here.
    stubCreateObjectStores(vi.fn<() => Promise<unknown>>(), vi.fn<() => Promise<void>>());
  });

  afterEach(() => {
    unmountAll();
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

      // The real picked_point type only allows numbers, but the composable
      // Defensively coerces string coordinates (e.g. locale-formatted
      // Values with a comma decimal separator) via String(...).replaceAll.
      viewerStore.picked_point = {
        // oxlint-disable-next-line no-unsafe-type-assertion -- exercising picked_point's defensive string-coordinate handling, which isn't represented in its declared type.
        x: "1,5" as unknown as number,
        y: 2,
        z: 3,
      };
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
        .fn<
          (
            point: { x: number | string; y: number | string; z: number | string },
            points: unknown[],
          ) => boolean
        >()
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
