import { type Mock, afterEach, beforeEach, describe, expect, test, vi } from "vitest";
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

const OUT_OF_RANGE_INDEX = 5;

// Same window-Escape-listener leak concern as create_object.nuxt.test.ts:
// See createToolMounter()'s comment in tests/utils.ts for details.
const { mountTool, unmountAll } = createToolMounter();

function makePasteEvent(text: string): { event: ClipboardEvent; preventDefault: Mock<() => void> } {
  const preventDefault = vi.fn<() => void>();
  const eventStub = {
    clipboardData: { getData: (): string => text },
    preventDefault,
  };
  return {
    // oxlint-disable-next-line no-unsafe-type-assertion -- partial ClipboardEvent mock for testing paste handling, established repo pattern.
    event: eventStub as unknown as ClipboardEvent,
    preventDefault,
  };
}

describe("useCreateObjectTool composable interactions", () => {
  beforeEach(() => {
    setupActivePinia();
    // None of the tests in this file exercise createObject() or the preview watcher,
    // So a minimal stub is enough here.
    stubCreateObjectStores(vi.fn<() => Promise<unknown>>(), vi.fn<() => Promise<void>>());
  });

  afterEach(() => {
    unmountAll();
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
      expect(() => {
        result.sanitizeInput("1", OUT_OF_RANGE_INDEX, "x");
      }).not.toThrow();
    });
  });

  describe("handlePaste", () => {
    test("fills x, y, z from three pasted numbers", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const { event, preventDefault } = makePasteEvent("1.5 2.5 3.5");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "1.5", y: "2.5", z: "3.5" });
      expect(preventDefault).toHaveBeenCalledWith();
    });

    test("defaults z to 0 when only two numbers are pasted", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const { event } = makePasteEvent("1.5, 2.5");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "1.5", y: "2.5", z: "0" });
    });

    test("fills the target field and zero-fills the others when a single number is pasted", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const { event } = makePasteEvent("42");

      result.handlePaste(event, 0, "z");

      expect(result.points.value[0]).toStrictEqual({ x: "0", y: "0", z: "42" });
    });

    test("does nothing when the clipboard has no numbers", () => {
      const { result } = mountTool(() =>
        useCreateObjectTool({ namePrefix: "Curve", minPoints: 2, schema }),
      );
      const { event, preventDefault } = makePasteEvent("not a number");

      result.handlePaste(event, 0, "x");

      expect(result.points.value[0]).toStrictEqual({ x: "", y: "", z: "" });
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
