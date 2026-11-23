import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { type FeedbackAction, useFeedbackStore } from "@ogw_front/stores/feedback";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { AssignResponse } from "@vease/composables/crs_assign";
import { setupActivePinia } from "@vease_tests/utils";
import type { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useProjectCrs } from "@vease/composables/project_crs";

vi.setConfig({ testTimeout: 10_000 });

const { assignCrs, convertCrs } = vi.hoisted(() => ({
  assignCrs: vi.fn<(item: unknown, crs: unknown, options?: unknown) => Promise<AssignResponse>>(),
  convertCrs: vi.fn<(item: unknown, crs: unknown, options?: unknown) => Promise<void>>(),
}));

vi.mock(import("@vease/composables/crs"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- only these are used by useProjectCrs.
  useCrs: (() => ({ assignCrs, convertCrs })) as unknown as typeof useCrs,
}));

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };

function dataItem(id: string, created_at: string, crs?: typeof LAMBERT): DataItem {
  // oxlint-disable-next-line no-unsafe-type-assertion -- minimal item, only fields read by useProjectCrs.
  return { data_id: id, name: id, created_at, ...(crs !== undefined && { crs }) } as DataItem;
}

function setItems(items: DataItem[]): void {
  vi.spyOn(useDataStore(), "allItems").mockResolvedValue(items);
}

// oxlint-disable-next-line typescript/explicit-function-return-type -- spy types are inferred from the store.
function spyFeedback() {
  const feedbackStore = useFeedbackStore();
  return {
    addSuccess: vi.spyOn(feedbackStore, "add_success"),
    addWarning: vi.spyOn(feedbackStore, "add_warning"),
  };
}

describe("useProjectCrs composable", () => {
  beforeEach(() => {
    setupActivePinia();
    convertCrs.mockReset().mockResolvedValue(undefined);
    assignCrs.mockReset().mockResolvedValue({});
  });

  test("an empty batch does not read the data", async () => {
    const allItems = vi.spyOn(useDataStore(), "allItems");
    await useProjectCrs().harmonizeImportedCrs([]);
    expect(allItems).not.toHaveBeenCalled();
  });

  test("does nothing without georeferenced data", async () => {
    const { addSuccess, addWarning } = spyFeedback();
    setItems([dataItem("a", "1"), dataItem("b", "2")]);
    await useProjectCrs().harmonizeImportedCrs(["b"]);
    expect(convertCrs).not.toHaveBeenCalled();
    expect(addSuccess).not.toHaveBeenCalled();
    expect(addWarning).not.toHaveBeenCalled();
  });

  test("the reference is the oldest existing data, not the batch", async () => {
    setItems([
      dataItem("new", "1", UTM),
      dataItem("old", "2", UTM),
      dataItem("older", "0", LAMBERT),
    ]);
    await useProjectCrs().harmonizeImportedCrs(["new"]);
    expect(convertCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "new" }),
      LAMBERT,
      { focus: false },
    );
  });

  test("the reference given by the import wins over a project crs that followed the data", async () => {
    // The imported UTM data landed: the project followed them before the harmonization
    useCrsStore().setProjectCrs(UTM);
    setItems([dataItem("new", "1", UTM)]);
    await useProjectCrs().harmonizeImportedCrs(["new"], LAMBERT);
    expect(convertCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "new" }),
      LAMBERT,
      { focus: false },
    );
  });

  test("the reference is the project crs once set", async () => {
    // The older data stayed in Lambert-93 (flagged in the tree): the project is the reference
    useCrsStore().setProjectCrs(UTM);
    setItems([dataItem("older", "0", LAMBERT), dataItem("new", "1", LAMBERT)]);
    await useProjectCrs().harmonizeImportedCrs(["new"]);
    expect(convertCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "new" }),
      UTM,
      { focus: false },
    );
  });

  test("an empty project takes its reference from the oldest imported data", async () => {
    setItems([dataItem("b", "2", UTM), dataItem("a", "1", LAMBERT)]);
    await useProjectCrs().harmonizeImportedCrs(["a", "b"]);
    expect(convertCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "b" }),
      LAMBERT,
      { focus: false },
    );
  });

  test("data in the horizontal part of a compound project crs is left alone", async () => {
    const nztm = { authority: "EPSG", code: "2193", name: "NZGD2000 / NZTM 2000" };
    const nztmNzvd = { authority: "EPSG", code: "2193+7839", name: "NZTM 2000 + NZVD2016 height" };
    useCrsStore().setProjectCrs(nztmNzvd);
    setItems([dataItem("model", "1", nztmNzvd), dataItem("map", "2", nztm)]);
    await useProjectCrs().harmonizeImportedCrs(["map"]);
    expect(convertCrs).not.toHaveBeenCalled();
  });

  test("data in the same crs is left alone", async () => {
    const { addSuccess, addWarning } = spyFeedback();
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2", { ...LAMBERT, name: "other name" })]);
    await useProjectCrs().harmonizeImportedCrs(["b"]);
    expect(convertCrs).not.toHaveBeenCalled();
    expect(addSuccess).not.toHaveBeenCalled();
    expect(addWarning).not.toHaveBeenCalled();
  });

  test("converted data is reported in a single success", async () => {
    const { addSuccess } = spyFeedback();
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2", UTM), dataItem("c", "3", UTM)]);
    await useProjectCrs().harmonizeImportedCrs(["b", "c"]);
    expect(convertCrs).toHaveBeenCalledTimes(2);
    expect(addSuccess).toHaveBeenCalledExactlyOnceWith("Converted to EPSG:2154: b, c");
  });

  test("a failed conversion is reported with an edit action, and the batch goes on", async () => {
    const { addSuccess, addWarning } = spyFeedback();
    const captured: { action?: FeedbackAction } = {};
    addWarning.mockImplementation((_description, action) => {
      captured.action = action;
    });
    const requestCrsEdit = vi.spyOn(useCrsStore(), "requestCrsEdit");
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2", UTM), dataItem("c", "3", UTM)]);
    convertCrs.mockRejectedValueOnce(new Error("PROJ"));

    await useProjectCrs().harmonizeImportedCrs(["b", "c"]);

    expect(addSuccess).toHaveBeenCalledExactlyOnceWith("Converted to EPSG:2154: c");
    expect(addWarning).toHaveBeenCalledExactlyOnceWith(
      "Could not convert to EPSG:2154: b",
      expect.objectContaining({ label: "Edit CRS" }),
    );
    captured.action?.onClick();
    expect(requestCrsEdit).toHaveBeenCalledExactlyOnceWith("b");
  });

  test("data without crs take the project crs in one request, when their coordinates fit it", async () => {
    const { addSuccess } = spyFeedback();
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2"), dataItem("c", "3")]);
    assignCrs.mockResolvedValue({
      crs: LAMBERT,
      implausible: false,
      linked: [{ id: "c", crs: LAMBERT, implausible: false }],
    });
    await useProjectCrs().harmonizeImportedCrs(["b", "c"]);
    expect(assignCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "b" }),
      LAMBERT,
      { linkedItems: [expect.objectContaining({ data_id: "c" })], onlyPlausible: true },
    );
    expect(addSuccess).toHaveBeenCalledExactlyOnceWith("EPSG:2154 assigned: b, c");
  });

  // Coordinates out of the project CRS area are likely local: the warning leads to the alignment
  test("data without crs whose coordinates miss the project crs get a georeference warning", async () => {
    const { addWarning } = spyFeedback();
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2"), dataItem("grid", "3")]);
    assignCrs.mockResolvedValue({
      implausible: true,
      linked: [{ id: "grid", unsupported: true }],
    });
    await useProjectCrs().harmonizeImportedCrs(["b", "grid"]);
    expect(addWarning).toHaveBeenCalledExactlyOnceWith(
      "b: these coordinates do not match EPSG:2154. Georeference the data?",
      expect.objectContaining({ label: "Georeference" }),
    );
  });

  test("a refused assignment falls back to the warning to edit the crs", async () => {
    const { addWarning } = spyFeedback();
    setItems([dataItem("a", "1", LAMBERT), dataItem("b", "2")]);
    assignCrs.mockRejectedValue(new Error("back"));
    await useProjectCrs().harmonizeImportedCrs(["b"]);
    expect(addWarning).toHaveBeenCalledExactlyOnceWith(
      "No CRS, project in EPSG:2154: b",
      expect.objectContaining({ label: "Edit CRS" }),
    );
  });

  test("a project crs chosen later is assigned to the data without crs", async () => {
    vi.spyOn(useCrsStore(), "crsItems", "get").mockReturnValue([
      dataItem("a", "1", LAMBERT),
      dataItem("b", "2"),
    ]);
    await useProjectCrs().adoptProjectCrs(UTM);
    expect(assignCrs).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ data_id: "b" }),
      UTM,
      { linkedItems: [], onlyPlausible: true },
    );
  });

  test("batches run one after another, even after a failure", async () => {
    const allItems = vi.spyOn(useDataStore(), "allItems");
    allItems.mockRejectedValueOnce(new Error("db"));
    allItems.mockResolvedValue([dataItem("a", "1", LAMBERT), dataItem("b", "2", UTM)]);
    const pendingConversion = Promise.withResolvers<undefined>();
    convertCrs.mockReturnValueOnce(pendingConversion.promise);
    const { harmonizeImportedCrs } = useProjectCrs();

    await expect(harmonizeImportedCrs(["x"])).rejects.toThrow("db");
    const first = harmonizeImportedCrs(["b"]);
    const second = harmonizeImportedCrs(["b"]);
    await vi.waitFor(() => {
      expect(convertCrs).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ data_id: "b" }),
        LAMBERT,
        { focus: false },
      );
    });
    expect(allItems).toHaveBeenCalledTimes(2);

    pendingConversion.resolve(undefined);
    await Promise.all([first, second]);
    expect(allItems).toHaveBeenCalledTimes(3);
    expect(convertCrs).toHaveBeenCalledTimes(2);
  });
});
