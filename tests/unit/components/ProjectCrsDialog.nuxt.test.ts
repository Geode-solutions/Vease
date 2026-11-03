import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import ProjectCrsDialog from "@vease/components/ProjectCrsDialog.vue";
import { flushPromises } from "@vue/test-utils";
import type { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the CrsSelector stub can emit UTM
const { UTM, CRS_SELECTOR_STUB } = vi.hoisted(() => {
  const utm = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };
  return {
    UTM: utm,
    CRS_SELECTOR_STUB: {
      name: "CrsSelector",
      emits: ["update:modelValue"],
      data: (): { crs: typeof utm } => ({ crs: utm }),
      template:
        "<button data-testid='crsSelectorStub' @click=\"$emit('update:modelValue', crs)\" />",
    },
  };
});
// Hoisted with vi.mock, so the useCrs mock can be checked by the tests
const { changeProjectCrs } = vi.hoisted(() => ({
  changeProjectCrs: vi.fn<(crs: unknown) => Promise<void>>(),
}));

vi.mock(import("@vease/composables/crs"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
  useCrs: (() => ({ changeProjectCrs })) as unknown as typeof useCrs,
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: GLASS_CARD_STUB as unknown as typeof GlassCard,
}));

vi.mock(import("@ogw_front/components/CrsSelector.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: CRS_SELECTOR_STUB as unknown as typeof CrsSelector,
}));

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };

function click(testId: string): void {
  document.body
    .querySelector(`[data-testid="${testId}"]`)
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

describe("project crs dialog", () => {
  beforeEach(() => {
    setupActivePinia();
    changeProjectCrs.mockReset().mockResolvedValue(undefined);
    useCrsStore().setProjectCrs(LAMBERT);
  });

  test("shows the project crs and no mode", async () => {
    const wrapper = mountWithPlugins(ProjectCrsDialog, {
      props: { show: true },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.body.textContent).toContain("Project CRS");
    expect(document.body.querySelector('[data-testid="projectCrsCurrent"]')?.textContent).toContain(
      "EPSG:2154",
    );
    expect(document.body.querySelector('[data-testid="crsModeAssign"]')).toBeNull();
    wrapper.unmount();
  });

  test("changes the project crs with every data", async () => {
    const wrapper = mountWithPlugins(ProjectCrsDialog, {
      props: { show: true },
      attachTo: document.body,
    });
    await flushPromises();
    click("crsSelectorStub");
    await flushPromises();
    click("projectCrsApply");
    await flushPromises();
    // The composable reads the data itself
    expect(changeProjectCrs).toHaveBeenCalledWith(UTM);
    expect(wrapper.emitted("changed")).toHaveLength(1);
    expect(wrapper.emitted("update:show")).toStrictEqual([[false]]);
    wrapper.unmount();
  });

  test("stays open when the change fails", async () => {
    changeProjectCrs.mockRejectedValueOnce(new Error("Coordinates cannot be converted"));
    const wrapper = mountWithPlugins(ProjectCrsDialog, {
      props: { show: true },
      attachTo: document.body,
    });
    await flushPromises();
    click("crsSelectorStub");
    await flushPromises();
    click("projectCrsApply");
    await flushPromises();
    expect(wrapper.emitted("update:show")).toBeUndefined();
    expect(wrapper.emitted("changed")).toBeUndefined();
    wrapper.unmount();
  });
});
