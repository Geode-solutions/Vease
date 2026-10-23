import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ImportFile from "@vease/components/ImportFile.vue";
import { flushPromises } from "@vue/test-utils";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import type { useProjectCrs } from "@vease/composables/project_crs";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importWorkflow: vi.fn<typeof importWorkflow>(),
}));

const { harmonizeImportedCrs } = vi.hoisted(() => ({
  harmonizeImportedCrs: vi.fn<(ids: string[]) => Promise<void>>(),
}));

vi.mock(import("@vease/composables/project_crs"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- only harmonizeImportedCrs is used.
  useProjectCrs: (() => ({ harmonizeImportedCrs })) as unknown as typeof useProjectCrs,
}));

const SAMPLE_FILENAME = "grid.vtp";
const GEODE_TYPE = "BRep";

function toItems(ids: string[]): DataItem[] {
  // oxlint-disable-next-line no-unsafe-type-assertion -- only ids are read.
  return ids.map((id) => ({ id }) as DataItem);
}

function setItemIds(before: string[], after: string[]): void {
  vi.spyOn(useDataStore(), "allItems")
    .mockResolvedValueOnce(toItems(before))
    .mockResolvedValueOnce(toItems(after));
}

async function clickImport(): Promise<void> {
  const wrapper = mountWithPlugins(ImportFile, {
    props: {
      filenames: [SAMPLE_FILENAME],
      geodeObjectTypes: { [SAMPLE_FILENAME]: GEODE_TYPE },
    },
  });
  await wrapper.find('[data-testid="finalizeImportButton"]').trigger("click");
  await flushPromises();
}

describe("the ImportFile component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(importWorkflow).mockReset();
    vi.mocked(importWorkflow).mockResolvedValue([]);
    harmonizeImportedCrs.mockReset().mockResolvedValue(undefined);
    vi.spyOn(useDataStore(), "allItems").mockResolvedValue([]);
  });

  test("harmonizes the crs of the newly imported items", async () => {
    setItemIds(["old"], ["old", "new"]);
    await clickImport();
    expect(harmonizeImportedCrs).toHaveBeenCalledExactlyOnceWith(["new"]);
  });

  test("harmonizes the imported items even when another file failed", async () => {
    vi.mocked(importWorkflow).mockRejectedValue(
      new AggregateError([], "1 file(s) could not be imported"),
    );
    setItemIds([], ["new"]);
    await clickImport();
    expect(harmonizeImportedCrs).toHaveBeenCalledExactlyOnceWith(["new"]);
  });

  test("renders import and cancel buttons", () => {
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: GEODE_TYPE },
      },
    });

    expect(wrapper.text()).toContain("Import");
    expect(wrapper.text()).toContain("Cancel");
  });

  test("calls importWorkflow and updates UIStore on import click", async () => {
    const uiStore = useUIStore();
    const setShowStepperSpy = vi.spyOn(uiStore, "setShowStepper");

    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: GEODE_TYPE },
      },
    });

    const importBtn = wrapper.find('[data-testid="finalizeImportButton"]');
    await importBtn.trigger("click");
    await flushPromises();

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
    ]);
    expect(wrapper.emitted("reset_values")).toStrictEqual([[]]);
    expect(setShowStepperSpy).toHaveBeenCalledWith(false);
  });

  test("emits reset_values and closes stepper when cancel button is clicked", async () => {
    const uiStore = useUIStore();
    const setShowStepperSpy = vi.spyOn(uiStore, "setShowStepper");

    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: GEODE_TYPE },
      },
    });

    const [, cancelBtn] = wrapper.findAll("button");
    await cancelBtn?.trigger("click");

    expect(wrapper.emitted("reset_values")).toStrictEqual([[]]);
    expect(setShowStepperSpy).toHaveBeenCalledWith(false);
  });

  test("imports each file with its own type and skips the others", async () => {
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME, "model.og_brep", "unsupported.toto", "skipped.vtu"],
        geodeObjectTypes: {
          [SAMPLE_FILENAME]: GEODE_TYPE,
          "model.og_brep": "StructuralModel",
          "skipped.vtu": "SolidMesh3D",
        },
        skippedFiles: ["skipped.vtu"],
      },
    });

    await wrapper.find('[data-testid="finalizeImportButton"]').trigger("click");
    await flushPromises();

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
      { filename: "model.og_brep", geode_object_type: "StructuralModel" },
    ]);
  });
});
