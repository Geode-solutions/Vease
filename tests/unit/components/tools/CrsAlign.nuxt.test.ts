import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { SOURCE, TARGET, fill, fillPoints, item } from "@vease_tests/utils/crs_align_fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CrsAlign from "@vease/components/tools/CrsAlign.vue";
import type CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import { flushPromises } from "@vue/test-utils";
import type { useCrs } from "@vease/composables/crs";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the CrsSelector stub can emit LAMBERT
const { LAMBERT, CRS_SELECTOR_STUB, USE_CRS_MOCK, alignCrs, followProject } = vi.hoisted(() => {
  const lambert = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
  const alignMock = vi.fn<(...args: unknown[]) => Promise<unknown>>();
  const followMock = vi.fn<(...args: unknown[]) => Promise<void>>();
  return {
    LAMBERT: lambert,
    alignCrs: alignMock,
    followProject: followMock,
    USE_CRS_MOCK: (): unknown => ({
      alignCrs: alignMock,
      followProject: followMock,
      convertCrs: vi.fn<() => Promise<void>>(),
    }),
    CRS_SELECTOR_STUB: {
      name: "CrsSelector",
      emits: ["update:modelValue"],
      data: (): { crs: typeof lambert } => ({ crs: lambert }),
      template:
        "<button data-testid='crsSelectorStub' @click=\"$emit('update:modelValue', crs)\" />",
    },
  };
});

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: GLASS_CARD_STUB as unknown as typeof GlassCard,
}));

vi.mock(import("@ogw_front/components/CrsSelector.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: CRS_SELECTOR_STUB as unknown as typeof CrsSelector,
}));

vi.mock(import("@vease/composables/crs"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
  useCrs: USE_CRS_MOCK as unknown as typeof useCrs,
}));

describe("crs align tool", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
    alignCrs.mockReset().mockResolvedValue(undefined);
    followProject.mockReset().mockResolvedValue(undefined);
    useUIStore().openCrsAlign(item);
  });

  test("asks for three pairs", () => {
    const wrapper = mountWithPlugins(CrsAlign);
    expect(wrapper.findAll('[data-testid^="crsAlignSource-"]')).toHaveLength(3);
    expect(wrapper.findAll('[data-testid^="crsAlignTarget-"]')).toHaveLength(3);
    wrapper.unmount();
  });

  test("applies an affine alignment once every point and the crs are set", async () => {
    const success = vi.spyOn(useFeedbackStore(), "add_success");
    const wrapper = mountWithPlugins(CrsAlign);
    const apply = wrapper.find('[data-testid="crsAlignApplyButton"]');
    expect(apply.attributes("disabled")).toBeDefined();

    await fillPoints(wrapper);
    await wrapper.find('[data-testid="crsSelectorStub"]').trigger("click");
    await flushPromises();
    await apply.trigger("click");
    await flushPromises();

    // Typed source points are original coordinates, not picked on the displayed data
    const typedSource = SOURCE.map(({ x, y }) => ({ x, y, picked: false }));
    expect(alignCrs).toHaveBeenCalledWith(item, LAMBERT, {
      sourcePoints: typedSource,
      targetPoints: TARGET,
      linkedItems: [],
    });
    expect(success).toHaveBeenCalledWith("Data georeferenced");
    expect(useUIStore().showCrsAlign).toBe(false);
    wrapper.unmount();
  });

  test("opening for another item resets points", async () => {
    const wrapper = mountWithPlugins(CrsAlign);
    await fill(wrapper, "crsAlignSource-0", { x: 1, y: 2 });
    useUIStore().openCrsAlign({ ...item, id: "item-2" });
    await flushPromises();

    const inputs = wrapper.find('[data-testid="crsAlignSource-0"]').findAll("input");
    expect(inputs.map((input) => input.element.value)).toStrictEqual(["", ""]);
    wrapper.unmount();
  });
});
