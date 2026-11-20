import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import AppDrawers from "@vease/components/Layout/AppDrawers.vue";
import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import type InfraConnected from "@ogw_front/components/InfraConnected.vue";
import { importProject } from "@ogw_front/composables/project_manager";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/composables/project_manager"), () => ({
  importProject: vi.fn<typeof importProject>(),
}));

vi.mock(import("@ogw_front/components/InfraConnected.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of InfraConnected this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  default: {
    name: "InfraConnected",
    template: "<div><slot /></div>",
  } as unknown as typeof InfraConnected,
}));

vi.mock(import("@vease/components/Layout/DrawerManager.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of DrawerManager this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  default: {
    name: "DrawerManager",
    props: ["uiStore"],
    emits: ["files-dropped", "folders-dropped"],
    template: "<div />",
  } as unknown as typeof DrawerManager,
}));

function dropFiles(names: string[]): void {
  const wrapper = mountWithPlugins(AppDrawers);
  const files = names.map((name) => new File(["content"], name));
  wrapper.findComponent(DrawerManager).vm.$emit("files-dropped", files);
}

describe("appdrawers component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(importProject).mockClear();
  });

  test("dropping data files opens the import stepper", () => {
    dropFiles(["surface.og_tsf3d", "points.csv"]);
    const uiStore = useUIStore();

    expect(uiStore.showStepper).toBe(true);
    expect(uiStore.droppedFiles.map((file) => file.name)).toStrictEqual([
      "surface.og_tsf3d",
      "points.csv",
    ]);
    expect(importProject).not.toHaveBeenCalled();
  });

  test("dropping a .vease file opens the project", () => {
    dropFiles(["My_Project.VEASE"]);

    expect(importProject).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: "My_Project.VEASE" }),
    );
    expect(useUIStore().showStepper).toBe(false);
  });

  test("dropping a .vease file with other files warns and opens nothing", () => {
    dropFiles(["project.vease", "surface.og_tsf3d"]);

    expect(importProject).not.toHaveBeenCalled();
    expect(useUIStore().showStepper).toBe(false);
    expect(useFeedbackStore().feedbacks.map((feedback) => feedback.type)).toStrictEqual([
      "warning",
    ]);
  });
});
