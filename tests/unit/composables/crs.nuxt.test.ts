import {
  type BackRequest,
  type CrsStubs,
  type FocusCamera,
  LAMBERT,
  item,
  stubCrsStores,
} from "@vease_tests/utils/crs_fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { reloadObject } from "@ogw_front/utils/import_workflow";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrs } from "@vease/composables/crs";
import { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the reloadObject mock can record its call order
const { calls } = vi.hoisted(() => ({ calls: [] as string[] }));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  reloadObject: vi.fn<typeof reloadObject>().mockImplementation(async () => {
    calls.push("reload");
    await Promise.resolve();
  }),
}));

describe("useCrs composable", () => {
  let request: CrsStubs["request"] = vi.fn<BackRequest>();
  let focusCameraOnObject: CrsStubs["focusCameraOnObject"] = vi.fn<FocusCamera>();

  beforeEach(() => {
    setupActivePinia();
    ({ request, focusCameraOnObject } = stubCrsStores(calls));
  });

  test("convertCrs converts, reloads then focuses the object", async () => {
    await useCrs().convertCrs(item, LAMBERT);

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: "item-1", ...LAMBERT } }),
    );
    // The actor is rebuilt from the moved geometry before the CRS is stored: a basemap built
    // On the new CRS must never read the previous coordinates
    expect(calls).toStrictEqual(["request", "update", "reload", "update", "focus"]);
    expect(vi.mocked(useDataStore().updateItem).mock.calls).toStrictEqual([
      ["item-1", { binary_light_viewable: "light" }],
      ["item-1", { crs: LAMBERT }],
    ]);
    expect(focusCameraOnObject).toHaveBeenCalledWith("item-1");
    // The geometry moved: the local actor must be rebuilt
    expect(reloadObject).toHaveBeenCalledWith("item-1", { rebuildActor: true });
  });

  test("convertCrs without focus does not move the camera", async () => {
    await useCrs().convertCrs(item, LAMBERT, { focus: false });

    expect(calls).toStrictEqual(["request", "update", "reload", "update"]);
    expect(focusCameraOnObject).not.toHaveBeenCalled();
  });

  test("alignCrs sends source and target points", async () => {
    const source = [
      { x: 0, y: 0, picked: true },
      { x: 10, y: 0, picked: false },
      { x: 0, y: 10, picked: false },
    ];
    const target = [
      { x: 1000, y: 2000 },
      { x: 1000, y: 2020 },
      { x: 980, y: 2000 },
    ];

    await useCrs().alignCrs(item, LAMBERT, {
      sourcePoints: source,
      targetPoints: target,
    });

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          id: "item-1",
          source_points: source,
          target_points: target,
          ...LAMBERT,
        },
      }),
    );
    expect(calls).toStrictEqual(["request", "update", "reload", "update", "focus"]);
  });

  test("alignCrs aligns the linked items in the same request", async () => {
    const wells = { ...item, data_id: "item-2", name: "Wells" };
    request.mockImplementationOnce(async () => {
      calls.push("request");
      await Promise.resolve();
      return {
        crs: LAMBERT,
        binary_light_viewable: "light",
        linked: [{ id: "item-2", crs: LAMBERT, binary_light_viewable: "wells light" }],
      };
    });

    await useCrs().alignCrs(item, LAMBERT, {
      sourcePoints: [{ x: 0, y: 0, picked: false }],
      targetPoints: [{ x: 10, y: 10 }],
      linkedItems: [wells],
    });

    expect(request.mock.calls[0]?.[0].params).toMatchObject({ linked_ids: ["item-2"] });
    expect(useDataStore().updateItem).toHaveBeenCalledWith("item-2", {
      binary_light_viewable: "wells light",
    });
    expect(useDataStore().updateItem).toHaveBeenCalledWith("item-2", { crs: LAMBERT });
    // The camera focuses on the aligned item only, once every item is reloaded
    expect(calls).toStrictEqual([
      "request",
      "update",
      "reload",
      "update",
      "update",
      "reload",
      "update",
      "focus",
    ]);
  });

  test("convertCrs converts the linked items in the same request", async () => {
    const wells = { ...item, data_id: "item-2", name: "Wells" };
    request.mockImplementationOnce(async () => {
      calls.push("request");
      await Promise.resolve();
      return {
        crs: LAMBERT,
        binary_light_viewable: "light",
        linked: [{ id: "item-2", crs: LAMBERT, binary_light_viewable: "wells light" }],
      };
    });

    await useCrs().convertCrs(item, LAMBERT, { linkedItems: [wells] });

    expect(request.mock.calls[0]?.[0].params).toMatchObject({ linked_ids: ["item-2"] });
    expect(useDataStore().updateItem).toHaveBeenCalledWith("item-2", {
      binary_light_viewable: "wells light",
    });
    expect(useDataStore().updateItem).toHaveBeenCalledWith("item-2", { crs: LAMBERT });
    expect(calls).toStrictEqual([
      "request",
      "update",
      "reload",
      "update",
      "update",
      "reload",
      "update",
      "focus",
    ]);
  });
});
