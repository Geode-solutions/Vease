import {
  ASSIGN_ROUTE,
  type CrsRequest,
  LAMBERT,
  UTM,
  mockCrsItems,
  projectItems,
  stubCrsStores,
} from "@vease_tests/utils/crs_fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { reloadObject } from "@ogw_front/utils/import_workflow";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useDataStore } from "@ogw_front/stores/data";
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

describe("useCrs composable project", () => {
  const request = vi.fn<CrsRequest>();
  const focusCameraOnObject = vi.fn<(id: string) => void>();

  beforeEach(() => {
    setupActivePinia();
    stubCrsStores(request, focusCameraOnObject, calls);
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
