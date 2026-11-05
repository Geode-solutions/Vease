import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import {
  SOURCE,
  SOURCE_ORIGIN,
  TARGET,
  TARGET_ORIGIN,
  fill,
  item,
} from "@vease_tests/utils/crs_align_fixtures";
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
    alignCrs.mockReset().mockResolvedValue({});
    followProject.mockReset().mockResolvedValue(undefined);
    useUIStore().openCrsAlign(item);
  });

  test("applies an affine alignment once every point and the crs are set", async () => {
    const wrapper = mountWithPlugins(CrsAlign);
    await wrapper.find('[data-testid="crsAlignMode-affine"]').trigger("click");
    await flushPromises();
    const apply = wrapper.find('[data-testid="crsAlignApplyButton"]');
    expect(apply.attributes("disabled")).toBeDefined();

    await Promise.all(
      SOURCE.map(async (point, index) => {
        await fill(wrapper, `crsAlignSource-${index}`, point);
      }),
    );
    await Promise.all(
      TARGET.map(async (point, index) => {
        await fill(wrapper, `crsAlignTarget-${index}`, point);
      }),
    );
    await wrapper.find('[data-testid="crsSelectorStub"]').trigger("click");
    await flushPromises();
    await apply.trigger("click");
    await flushPromises();

    // Typed source points are original coordinates, not picked on the displayed data
    const typedSource = SOURCE.map(({ x, y }) => ({ x, y, picked: false }));
    expect(alignCrs).toHaveBeenCalledWith(item, LAMBERT, {
      sourcePoints: typedSource,
      targetPoints: TARGET,
      mode: "affine",
      linkedItems: [],
    });
    expect(useUIStore().showCrsAlign).toBe(false);
    wrapper.unmount();
  });

  test("aligns without distortion by default and reports scale and rotation", async () => {
    alignCrs.mockResolvedValue({ scale: 0.5, rotation: 12.4 });
    const success = vi.spyOn(useFeedbackStore(), "add_success");
    const wrapper = mountWithPlugins(CrsAlign);
    expect(wrapper.findAll('[data-testid^="crsAlignSource-"]')).toHaveLength(2);

    await fill(wrapper, "crsAlignSource-0", SOURCE_ORIGIN);
    await fill(wrapper, "crsAlignTarget-0", TARGET_ORIGIN);
    await wrapper.find('[data-testid="crsSelectorStub"]').trigger("click");
    await flushPromises();
    await wrapper.find('[data-testid="crsAlignApplyButton"]').trigger("click");
    await flushPromises();

    expect(alignCrs).toHaveBeenCalledWith(item, LAMBERT, {
      sourcePoints: [{ ...SOURCE_ORIGIN, picked: false }],
      targetPoints: [TARGET_ORIGIN],
      mode: "similarity",
      linkedItems: [],
    });
    expect(success).toHaveBeenCalledWith("Data georeferenced: scale ×0.50, rotation 12°");
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
