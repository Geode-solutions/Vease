// oxlint-disable max-dependencies
import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { type DataItem as StoredItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CrsAlign from "@vease/components/tools/CrsAlign.vue";
import type CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import { flushPromises } from "@vue/test-utils";
import type { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";
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

// Wells share the local frame of the model; the map is already in another CRS
function mountWithWells(): { wrapper: ReturnType<typeof mountWithPlugins>; wells: StoredItem } {
  const stored: StoredItem = { ...item, created_at: "2026-10-27" };
  const wells: StoredItem = { ...stored, id: "item-2", name: "Wells" };
  const georeferenced: StoredItem = { ...stored, id: "item-3", name: "Map", crs: LAMBERT };
  vi.spyOn(useDataStore(), "refCrsItems").mockReturnValue(ref([stored, wells, georeferenced]));
  return { wrapper: mountWithPlugins(CrsAlign), wells };
}

async function fillPoints(wrapper: ReturnType<typeof mountWithPlugins>): Promise<void> {
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
}

async function applyPoints(wrapper: ReturnType<typeof mountWithPlugins>): Promise<void> {
  await fillPoints(wrapper);
  await wrapper.find('[data-testid="crsSelectorStub"]').trigger("click");
  await flushPromises();
  await wrapper.find('[data-testid="crsAlignApplyButton"]').trigger("click");
  await flushPromises();
}

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

  test("georeferences every data in the same crs state by default, then follows the project", async () => {
    const success = vi.spyOn(useFeedbackStore(), "add_success");
    const utm = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };
    const { wrapper, wells } = mountWithWells();
    useCrsStore().setProjectCrs(utm);
    expect(wrapper.find('[data-testid="crsAlignScope-all"] input').element).toHaveProperty(
      "checked",
      true,
    );
    await applyPoints(wrapper);

    expect(alignCrs).toHaveBeenCalledWith(
      item,
      LAMBERT,
      expect.objectContaining({ linkedItems: [wells] }),
    );
    expect(followProject).toHaveBeenCalledWith(
      [
        { id: item.id, name: item.name, crs: LAMBERT },
        { id: "item-2", name: "Wells", crs: LAMBERT },
      ],
      utm,
    );
    expect(success).toHaveBeenCalledWith("Data georeferenced (2 items)");
    wrapper.unmount();
  });

  // Data in the same CRS are usually the whole project: a re-align moves this data only by default
  test("re-aligning a georeferenced data defaults to this data only", async () => {
    useUIStore().openCrsAlign({ ...item, crs: LAMBERT });
    const wrapper = mountWithPlugins(CrsAlign);
    await flushPromises();
    expect(wrapper.find('[data-testid="crsAlignScope-one"] input').element).toHaveProperty(
      "checked",
      true,
    );
    wrapper.unmount();
  });

  test("georeferences this data only", async () => {
    const { wrapper } = mountWithWells();
    await wrapper.find('[data-testid="crsAlignScope-one"] input').setValue(true);
    await applyPoints(wrapper);

    expect(alignCrs).toHaveBeenCalledWith(
      item,
      LAMBERT,
      expect.objectContaining({ linkedItems: [] }),
    );
    expect(followProject).toHaveBeenCalledWith(
      [{ id: item.id, name: item.name, crs: LAMBERT }],
      // The map is the only georeferenced data: the project is in its crs
      LAMBERT,
    );
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
