import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import { type MockInstance, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { DataItem } from "@vease/types/data_item";
import { ref } from "vue";

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };
const item: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Points",
  geode_object_type: "PointSet3D",
  viewer_type: "mesh",
  visible: true,
};

const ASSIGN_ROUTE = "opengeodeweb_back/crs/assign_geographic";

// Oldest first: a and c in Lambert-93, b already in UTM, local1 and local2 without CRS
function projectItems(): DataItem[] {
  return [
    { ...item, id: "a", created_at: "1", crs: LAMBERT },
    { ...item, id: "b", created_at: "2", crs: UTM },
    { ...item, id: "c", created_at: "3", crs: LAMBERT },
    { ...item, id: "local1", created_at: "4" },
    { ...item, id: "local2", created_at: "5" },
  ];
}

// The crs store reads the data when it is created: mocked first
function mockCrsItems(items: DataItem[]): void {
  vi.spyOn(useDataStore(), "refCrsItems").mockReturnValue(
    ref<CrsItem[]>(
      items.map(({ id, name, crs, created_at }) => ({
        id,
        name,
        crs,
        created_at: created_at ?? "",
      })),
    ),
  );
}

type BackRequest = ReturnType<typeof getBackStore>["request"];
type FocusCamera = ReturnType<typeof getHybridViewerStore>["focusCameraOnObject"];

interface CrsStubs {
  request: MockInstance<BackRequest>;
  focusCameraOnObject: MockInstance<FocusCamera>;
}

// To call in beforeEach, after setupActivePinia(). Shares its call log with the reloadObject mock.
function stubCrsStores(calls: string[]): CrsStubs {
  calls.length = 0;
  const request = vi.spyOn(getBackStore(), "request").mockImplementation(async () => {
    calls.push("request");
    await Promise.resolve();
    return { binary_light_viewable: "light", crs: LAMBERT };
  });
  vi.spyOn(useDataStore(), "updateItem").mockImplementation(async () => {
    calls.push("update");
    await Promise.resolve();
  });
  const focusCameraOnObject = vi
    .spyOn(getHybridViewerStore(), "focusCameraOnObject")
    .mockImplementation(() => {
      calls.push("focus");
    });
  return { request, focusCameraOnObject };
}

export {
  ASSIGN_ROUTE,
  type BackRequest,
  type CrsStubs,
  type FocusCamera,
  LAMBERT,
  UTM,
  item,
  mockCrsItems,
  projectItems,
  stubCrsStores,
};
