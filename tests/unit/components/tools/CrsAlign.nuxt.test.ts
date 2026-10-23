import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CrsAlign from "@vease/components/tools/CrsAlign.vue";
import type CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import { flushPromises } from "@vue/test-utils";
import type { useCrs } from "@vease/composables/crs";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the CrsSelector stub can emit LAMBERT
const { LAMBERT, CRS_SELECTOR_STUB, USE_CRS_MOCK, alignCrs } = vi.hoisted(() => {
  const lambert = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
  const alignMock = vi.fn<(...args: unknown[]) => Promise<void>>();
  return {
    LAMBERT: lambert,
    alignCrs: alignMock,
    USE_CRS_MOCK: (): unknown => ({
      alignCrs: alignMock,
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

const SOURCE = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 0, y: 10 },
];
const TARGET = [
  { x: 1000, y: 2000 },
  { x: 1000, y: 2020 },
  { x: 980, y: 2000 },
];

const item: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Points",
  geode_object_type: "PointSet3D",
  viewer_type: "mesh",
  visible: true,
};

async function fill(
  wrapper: ReturnType<typeof mountWithPlugins>,
  testId: string,
  point: { x: number; y: number },
): Promise<void> {
  const [xInput, yInput] = wrapper.find(`[data-testid="${testId}"]`).findAll("input");
  await xInput?.setValue(String(point.x));
  await yInput?.setValue(String(point.y));
}

describe("crs align tool", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
    alignCrs.mockReset().mockResolvedValue(undefined);
    useUIStore().openCrsAlign(item);
  });

  test("applies the alignment once every point and the crs are set", async () => {
    const wrapper = mountWithPlugins(CrsAlign);
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

    expect(alignCrs).toHaveBeenCalledWith(item, SOURCE, TARGET, LAMBERT);
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
