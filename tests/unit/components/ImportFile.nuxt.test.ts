import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ImportFile from "@vease/components/ImportFile.vue";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importWorkflow: vi.fn<typeof importWorkflow>(),
}));

const SAMPLE_FILENAME = "grid.vtp";
const GEODE_TYPE = "BRep";

describe("the ImportFile component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(importWorkflow).mockReset();
    vi.mocked(importWorkflow).mockResolvedValue([]);
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

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
      { filename: "model.og_brep", geode_object_type: "StructuralModel" },
    ]);
  });
});
