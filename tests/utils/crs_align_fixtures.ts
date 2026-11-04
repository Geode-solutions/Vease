import { type DataItem as StoredItem, useDataStore } from "@ogw_front/stores/data";
import CrsAlign from "@vease/components/tools/CrsAlign.vue";
import type { DataItem } from "@vease/types/data_item";
import { flushPromises } from "@vue/test-utils";
import { mountWithPlugins } from "@vease_tests/utils";
import { ref } from "vue";
import { vi } from "vitest";

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
function mountWithWells(lambert: StoredItem["crs"]): {
  wrapper: ReturnType<typeof mountWithPlugins>;
  wells: StoredItem;
} {
  const stored: StoredItem = { ...item, created_at: "2026-10-27" };
  const wells: StoredItem = { ...stored, id: "item-2", name: "Wells" };
  const georeferenced: StoredItem = { ...stored, id: "item-3", name: "Map", crs: lambert };
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

export { SOURCE, TARGET, applyPoints, fill, fillPoints, item, mountWithWells };
