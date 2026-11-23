import {
  type BackRequest,
  type CrsStubs,
  type FocusCamera,
  LAMBERT,
  UTM,
  mockCrsItems,
  projectItems,
  stubCrsStores,
} from "@vease_tests/utils/crs_fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { reloadObject } from "@ogw_front/utils/import_workflow";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useDataStore } from "@ogw_front/stores/data";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the reloadObject mock can record its call order
const { calls } = vi.hoisted(() => ({ calls: [] as string[] }));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  reloadObject: vi.fn<typeof reloadObject>().mockImplementation(async () => {
    calls.push("reload");
    await Promise.resolve();
  }),
}));

describe("useCrs composable project", () => {
  let request: CrsStubs["request"] = vi.fn<BackRequest>();
  let focusCameraOnObject: CrsStubs["focusCameraOnObject"] = vi.fn<FocusCamera>();

  beforeEach(() => {
    setupActivePinia();
    ({ request, focusCameraOnObject } = stubCrsStores(calls));
  });

  test("changeProjectCrs converts the georeferenced data, the data without crs keep none", async () => {
    mockCrsItems(projectItems());
    request.mockResolvedValueOnce({ binary_light_viewable: "light", crs: UTM });
    await useCrs().changeProjectCrs(UTM);

    expect(request.mock.calls.map(([call]) => call.params)).toStrictEqual([
      { id: "a", linked_ids: ["c"], ...UTM },
    ]);
    expect(useDataStore().updateItem).not.toHaveBeenCalledWith("local1", expect.anything());
    // The camera stays where it is: every data moves
    expect(focusCameraOnObject).not.toHaveBeenCalled();
    expect(useCrsStore().projectCrs).toStrictEqual(UTM);
  });

  test("changeProjectCrs only changes the project crs when no data has to move", async () => {
    mockCrsItems(projectItems().filter((projectItem) => projectItem.data_id === "b"));
    await useCrs().changeProjectCrs(UTM);

    expect(request).not.toHaveBeenCalled();
    expect(useCrsStore().projectCrs).toStrictEqual(UTM);
  });

  test("changeProjectCrs leaves the data in the horizontal part of a compound crs", async () => {
    const nztm = { authority: "EPSG", code: "2193", name: "NZGD2000 / NZTM 2000" };
    const nztmNzvd = { authority: "EPSG", code: "2193+7839", name: "NZTM 2000 + NZVD2016 height" };
    mockCrsItems(projectItems().map((projectItem) => Object.assign(projectItem, { crs: nztm })));
    await useCrs().changeProjectCrs(nztmNzvd);

    // Heights are a label of each data: X and Y do not move
    expect(request).not.toHaveBeenCalled();
    expect(useCrsStore().projectCrs).toStrictEqual(nztmNzvd);
  });

  test("a conversion that leaves the heights as they are warns about them", async () => {
    vi.spyOn(useDataStore(), "item").mockImplementation(async (dataId) => {
      await Promise.resolve();
      // oxlint-disable-next-line no-unsafe-type-assertion -- only the name is read
      return { data_id: dataId, name: `model ${dataId}` } as never;
    });
    request.mockResolvedValueOnce({
      binary_light_viewable: "light",
      crs: UTM,
      heights_unchanged: true,
      linked: [{ id: "c", binary_light_viewable: "light", crs: UTM }],
    });
    const addWarning = vi.spyOn(useFeedbackStore(), "add_warning");
    await useCrs().convertCrs({ data_id: "a" }, UTM, { linkedItems: [{ data_id: "c" }] });

    expect(addWarning).toHaveBeenCalledExactlyOnceWith(
      "Heights not converted: model a keeps its heights",
    );
  });

  test("changeProjectCrs keeps the project crs when the back refuses the conversion", async () => {
    mockCrsItems(projectItems());
    request.mockRejectedValueOnce(new Error("Coordinates cannot be converted to EPSG:32631"));
    useCrsStore().setProjectCrs(LAMBERT);

    await expect(useCrs().changeProjectCrs(UTM)).rejects.toThrow("EPSG:32631");
    expect(useCrsStore().projectCrs).toStrictEqual(LAMBERT);
  });

  test("followProject converts the data out of the project crs, in one request", async () => {
    mockCrsItems([]);
    useCrsStore().setProjectCrs(LAMBERT);
    await useCrs().followProject([
      { data_id: "a", name: "A", crs: UTM },
      { data_id: "b", name: "B", crs: LAMBERT },
      { data_id: "c", name: "C", crs: UTM },
    ]);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { id: "a", linked_ids: ["c"], ...LAMBERT } }),
    );
  });

  test("followProject does nothing without project crs", async () => {
    mockCrsItems([]);
    await useCrs().followProject([{ data_id: "a", name: "A", crs: UTM }]);
    expect(request).not.toHaveBeenCalled();
  });

  test("followProject warns with an edit action when the conversion is refused", async () => {
    mockCrsItems([]);
    useCrsStore().setProjectCrs(LAMBERT);
    request.mockRejectedValueOnce(new Error("Coordinates cannot be converted to EPSG:2154"));
    const warning = vi.spyOn(useFeedbackStore(), "add_warning");
    await useCrs().followProject([{ data_id: "a", name: "A", crs: UTM }]);
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
    await useCrs().followProject([{ data_id: "a", name: "A", crs: UTM }], LAMBERT);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { id: "a", ...LAMBERT } }),
    );
    expect(useCrsStore().projectCrs).toStrictEqual(LAMBERT);
  });
});
