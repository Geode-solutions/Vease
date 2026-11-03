import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { DataItem } from "@vease/types/data_item";
import { reloadObject } from "@ogw_front/utils/import_workflow";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the reloadObject mock can record its call order
const { calls } = vi.hoisted(() => ({ calls: [] as string[] }));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  reloadObject: vi.fn<typeof reloadObject>().mockImplementation(async () => {
    calls.push("reload");
    await Promise.resolve();
  }),
}));

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };
const item: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Points",
  geode_object_type: "PointSet3D",
  viewer_type: "mesh",
  visible: true,
};

const ASSIGN_ROUTE = "opengeodeweb_back/crs/assign_geographic";

// Oldest first: a and c in Lambert-93, b already in UTM, local1 and local2 without CRS
function projectItems(): DataItem[] {
  return [
    { ...item, id: "a", created_at: "1", crs: LAMBERT },
    { ...item, id: "b", created_at: "2", crs: UTM },
    { ...item, id: "c", created_at: "3", crs: LAMBERT },
    { ...item, id: "local1", created_at: "4" },
    { ...item, id: "local2", created_at: "5" },
  ];
}

// The crs store reads the data when it is created: mocked first
function mockCrsItems(items: DataItem[]): void {
  vi.spyOn(useDataStore(), "refCrsItems").mockReturnValue(
    ref<CrsItem[]>(
      items.map(({ id, name, crs, created_at }) => ({
        id,
        name,
        crs,
        created_at: created_at ?? "",
      })),
    ),
  );
}

describe("useCrs composable", () => {
  const request =
    vi.fn<(request: { schema: { $id: string }; params: unknown }) => Promise<unknown>>();
  const focusCameraOnObject = vi.fn<(id: string) => void>();

  beforeEach(() => {
    setupActivePinia();
    calls.length = 0;
    request.mockReset().mockImplementation(async () => {
      calls.push("request");
      await Promise.resolve();
      return { binary_light_viewable: "light", crs: LAMBERT };
    });
    vi.spyOn(useDataStore(), "updateItem").mockImplementation(async () => {
      calls.push("update");
      await Promise.resolve();
    });
    focusCameraOnObject.mockReset().mockImplementation(() => {
      calls.push("focus");
    });
    vi.mocked(getBackStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
      { request } as unknown as ReturnType<typeof getBackStore>,
    );
    vi.mocked(getHybridViewerStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
      { focusCameraOnObject } as unknown as ReturnType<typeof getHybridViewerStore>,
    );
  });

  test("convertCrs converts, reloads then focuses the object", async () => {
    await useCrs().convertCrs(item, LAMBERT);

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: "item-1", ...LAMBERT } }),
    );
    expect(calls).toStrictEqual(["request", "update", "reload", "focus"]);
    expect(useDataStore().updateItem).toHaveBeenCalledWith("item-1", {
      binary_light_viewable: "light",
      crs: LAMBERT,
    });
    expect(focusCameraOnObject).toHaveBeenCalledWith("item-1");
    // The geometry moved: the local actor must be rebuilt
    expect(reloadObject).toHaveBeenCalledWith("item-1", { rebuildActor: true });
  });

  test("convertCrs without focus does not move the camera", async () => {
    await useCrs().convertCrs(item, LAMBERT, { focus: false });

    expect(calls).toStrictEqual(["request", "update", "reload"]);
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
    expect(calls).toStrictEqual(["request", "update", "reload", "focus"]);
  });

  test("alignCrs aligns the linked items in the same request", async () => {
    const wells = { ...item, id: "item-2", name: "Wells" };
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
      crs: LAMBERT,
    });
    // The camera focuses on the aligned item only, once every item is reloaded
    expect(calls).toStrictEqual(["request", "update", "reload", "update", "reload", "focus"]);
  });

  test("convertCrs converts the linked items in the same request", async () => {
    const wells = { ...item, id: "item-2", name: "Wells" };
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
      crs: LAMBERT,
    });
    expect(calls).toStrictEqual(["request", "update", "reload", "update", "reload", "focus"]);
  });

  test("changeProjectCrs converts the georeferenced data, then assigns the plausible others", async () => {
    mockCrsItems(projectItems());
    request
      .mockResolvedValueOnce({ binary_light_viewable: "light", crs: UTM })
      // Local2 does not fit the crs: left without crs
      .mockResolvedValueOnce({
        crs: UTM,
        implausible: false,
        linked: [{ id: "local2", implausible: true }],
      });
    await useCrs().changeProjectCrs(UTM);

    expect(request.mock.calls.map(([call]) => call.params)).toStrictEqual([
      { id: "a", linked_ids: ["c"], ...UTM },
      { id: "local1", linked_ids: ["local2"], only_plausible: true, ...UTM },
    ]);
    expect(useDataStore().updateItem).toHaveBeenCalledWith("local1", { crs: UTM });
    expect(useDataStore().updateItem).not.toHaveBeenCalledWith("local2", expect.anything());
    // The camera stays where it is: every data moves
    expect(focusCameraOnObject).not.toHaveBeenCalled();
    expect(useCrsStore().projectCrs).toStrictEqual(UTM);
  });

  test("changeProjectCrs only changes the project crs when no data has to move", async () => {
    mockCrsItems(projectItems().filter((projectItem) => projectItem.id === "b"));
    await useCrs().changeProjectCrs(UTM);

    expect(request).not.toHaveBeenCalled();
    expect(useCrsStore().projectCrs).toStrictEqual(UTM);
  });

  test("changeProjectCrs keeps the project crs when the back refuses the conversion", async () => {
    mockCrsItems(projectItems());
    request.mockRejectedValueOnce(new Error("Coordinates cannot be converted to EPSG:32631"));
    useCrsStore().setProjectCrs(LAMBERT);

    await expect(useCrs().changeProjectCrs(UTM)).rejects.toThrow("EPSG:32631");
    // Nothing is assigned either
    expect(request.mock.calls.map(([call]) => call.schema.$id)).not.toContain(ASSIGN_ROUTE);
    expect(useCrsStore().projectCrs).toStrictEqual(LAMBERT);
  });

  test("followProject converts the data out of the project crs, in one request", async () => {
    mockCrsItems([]);
    useCrsStore().setProjectCrs(LAMBERT);
    await useCrs().followProject([
      { id: "a", name: "A", crs: UTM },
      { id: "b", name: "B", crs: LAMBERT },
      { id: "c", name: "C", crs: UTM },
    ]);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { id: "a", linked_ids: ["c"], ...LAMBERT } }),
    );
  });

  test("followProject does nothing without project crs", async () => {
    mockCrsItems([]);
    await useCrs().followProject([{ id: "a", name: "A", crs: UTM }]);
    expect(request).not.toHaveBeenCalled();
  });

  test("followProject warns with an edit action when the conversion is refused", async () => {
    mockCrsItems([]);
    useCrsStore().setProjectCrs(LAMBERT);
    request.mockRejectedValueOnce(new Error("Coordinates cannot be converted to EPSG:2154"));
    const warning = vi.spyOn(useFeedbackStore(), "add_warning");
    await useCrs().followProject([{ id: "a", name: "A", crs: UTM }]);
    expect(warning).toHaveBeenCalledExactlyOnceWith(
      "Cannot convert A to EPSG:2154. Check its CRS (Assign) or georeference it.",
      expect.objectContaining({ label: "Edit CRS" }),
    );
  });

  // The project may have followed the assigned data already: the reference is taken before
  test("followProject converts to the given project crs and restores it on refusal", async () => {
    mockCrsItems([]);
    useCrsStore().setProjectCrs(UTM);
    request.mockRejectedValueOnce(new Error("Coordinates cannot be converted to EPSG:2154"));
    await useCrs().followProject([{ id: "a", name: "A", crs: UTM }], LAMBERT);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { id: "a", ...LAMBERT } }),
    );
    expect(useCrsStore().projectCrs).toStrictEqual(LAMBERT);
  });
});
