import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createToolMounter, setupActivePinia } from "@vease_tests/utils";
import { flushPromises } from "@vue/test-utils";
import { useCrsAlign } from "@vease/composables/crs_align";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

// The composable registers a window-level Escape listener: every instance is unmounted in afterEach
const { mountTool, unmountAll } = createToolMounter();

describe("useCrsAlign composable", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  afterEach(() => {
    unmountAll();
  });

  test("fills the first empty source point with the picked x and y", async () => {
    const { result } = mountTool(() => useCrsAlign());
    const viewerStore = useViewerStore();
    result.togglePickMode();

    viewerStore.picked_point = { x: 1, y: 2, z: 3 };
    await flushPromises();

    expect(result.sourcePoints.value[0]).toStrictEqual({ x: 1, y: 2 });
    expect(result.sourcePoints.value[1]).toStrictEqual({ x: "", y: "" });
  });

  test("a picked source point is sent as picked until edited by hand", async () => {
    const { result } = mountTool(() => useCrsAlign());
    result.togglePickMode();

    useViewerStore().picked_point = { x: 1, y: 2, z: 3 };
    await flushPromises();
    expect(result.toSourceCrsPoints()[0]).toStrictEqual({ x: 1, y: 2, picked: true });

    result.editSourcePoint(0, "x", "5");
    expect(result.toSourceCrsPoints()[0]).toStrictEqual({ x: 5, y: 2, picked: false });
  });

  test("aligns without distortion on 2 rows by default", () => {
    const { result } = mountTool(() => useCrsAlign());
    expect(result.mode.value).toBe("similarity");
    expect(result.visibleSourcePoints.value).toHaveLength(2);
    expect(result.visibleTargetPoints.value).toHaveLength(2);
  });

  test("one pair is enough without distortion", () => {
    const { result } = mountTool(() => useCrsAlign());
    result.sourcePoints.value[0] = { x: 0, y: 0 };
    expect(result.isComplete.value).toBe(false);
    result.targetPoints.value[0] = { x: 1000, y: 2000 };
    expect(result.isComplete.value).toBe(true);
    expect(result.toSourceCrsPoints()).toStrictEqual([{ x: 0, y: 0, picked: false }]);
    expect(result.toTargetCrsPoints()).toStrictEqual([{ x: 1000, y: 2000 }]);
  });

  test("a half filled second pair blocks the alignment", () => {
    const { result } = mountTool(() => useCrsAlign());
    result.sourcePoints.value[0] = { x: 0, y: 0 };
    result.targetPoints.value[0] = { x: 1000, y: 2000 };
    result.sourcePoints.value[1] = { x: 10, y: 0 };
    expect(result.isComplete.value).toBe(false);
    result.targetPoints.value[1] = { x: 1000, y: 2020 };
    expect(result.isComplete.value).toBe(true);
    expect(result.toTargetCrsPoints()).toHaveLength(2);
  });

  test("affine needs 3 pairs and ignores the third once back without distortion", () => {
    const { result } = mountTool(() => useCrsAlign());
    result.setMode("affine");
    expect(result.visibleSourcePoints.value).toHaveLength(3);
    result.sourcePoints.value = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
    ];
    result.targetPoints.value = [
      { x: 1000, y: 2000 },
      { x: 1000, y: 2020 },
      { x: 980, y: 2000 },
    ];
    expect(result.isComplete.value).toBe(true);
    expect(result.toSourceCrsPoints()).toHaveLength(3);
    result.setMode("similarity");
    expect(result.toSourceCrsPoints()).toHaveLength(2);
    expect(result.toTargetCrsPoints()).toHaveLength(2);
  });

  test("picking fills only the rows of the mode", async () => {
    const { result } = mountTool(() => useCrsAlign());
    result.sourcePoints.value[0] = { x: 0, y: 0 };
    result.sourcePoints.value[1] = { x: 10, y: 0 };
    result.togglePickMode();

    useViewerStore().picked_point = { x: 1, y: 2, z: 3 };
    await flushPromises();

    expect(result.sourcePoints.value[2]).toStrictEqual({ x: "", y: "" });
  });

  test("a coordinate being typed is not a number yet", () => {
    const { result } = mountTool(() => useCrsAlign());
    result.setMode("affine");
    result.sourcePoints.value = [
      { x: "-", y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
    ];
    result.targetPoints.value = [
      { x: 1000, y: 2000 },
      { x: 1000, y: 2020 },
      { x: 980, y: 2000 },
    ];
    expect(result.isComplete.value).toBe(false);
  });

  test("reset clears points and stops picking", () => {
    const { result } = mountTool(() => useCrsAlign());
    const toggleSpy = vi.spyOn(useViewerStore(), "toggle_picking_mode");
    result.sourcePoints.value[0] = { x: 1, y: 2 };
    result.togglePickMode();

    result.setMode("affine");
    result.reset();

    expect(result.sourcePoints.value[0]).toStrictEqual({ x: "", y: "" });
    expect(toggleSpy).toHaveBeenLastCalledWith(false);
    expect(result.mode.value).toBe("similarity");
  });
});
