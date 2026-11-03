import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import { type Mock, vi } from "vitest";
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

type CrsRequest = (request: { schema: { $id: string }; params: unknown }) => Promise<unknown>;

// To call in beforeEach, after setupActivePinia(). Requires the test file to
// Vi.mock("@vease/utils/external_stores") and to share its call log with the reloadObject mock.
function stubCrsStores(
  request: Mock<CrsRequest>,
  focusCameraOnObject: Mock<(id: string) => void>,
  calls: string[],
): void {
  calls.length = 0;
  request.mockReset().mockImplementation(async () => {
    calls.push("request");
    await Promise.resolve();
    return { binary_light_viewable: "light", crs: LAMBERT };
  });
  vi.spyOn(useDataStore(), "updateItem").mockImplementation(async () => {
    calls.push("update");
    await Promise.resolve();
  });
  focusCameraOnObject.mockReset().mockImplementation(() => {
    calls.push("focus");
  });
  vi.mocked(getBackStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
    { request } as unknown as ReturnType<typeof getBackStore>,
  );
  vi.mocked(getHybridViewerStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
    { focusCameraOnObject } as unknown as ReturnType<typeof getHybridViewerStore>,
  );
}

export {
  ASSIGN_ROUTE,
  type CrsRequest,
  LAMBERT,
  UTM,
  item,
  mockCrsItems,
  projectItems,
  stubCrsStores,
};
