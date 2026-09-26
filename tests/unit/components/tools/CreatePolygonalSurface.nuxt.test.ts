import { type VueWrapper, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import CreatePolygonalSurface from "@vease/components/tools/CreatePolygonalSurface.vue";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const INITIAL_SURFACE_POINTS = 3;
const ADDED_SURFACE_POINTS = 4;
const FIRST_INDEX = 0;
const POINT_ONE_X = "1";
const POINT_ONE_Y = "2";
const POINT_ONE_Z = "3";
const POINT_TWO_X = "4";
const POINT_TWO_Y = "5";
const POINT_TWO_Z = "6";
const POINT_THREE_X = "7";
const POINT_THREE_Y = "8";
const POINT_THREE_Z = "9";
const NUM_ONE_X = Number(POINT_ONE_X);
const NUM_ONE_Y = Number(POINT_ONE_Y);
const NUM_ONE_Z = Number(POINT_ONE_Z);
const NUM_TWO_X = Number(POINT_TWO_X);
const NUM_TWO_Y = Number(POINT_TWO_Y);
const NUM_TWO_Z = Number(POINT_TWO_Z);
const NUM_THREE_X = Number(POINT_THREE_X);
const NUM_THREE_Y = Number(POINT_THREE_Y);
const NUM_THREE_Z = Number(POINT_THREE_Z);

describe("the CreatePolygonalSurface component", () => {
  beforeEach(() => {
    setupActivePinia();
    const backStoreStub = {
      base_url: "http://localhost",
      request: vi.fn<() => Promise<unknown>>().mockResolvedValue({ id: "surface-id" }),
    };
    vi.mocked(getBackStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
      backStoreStub as unknown as ReturnType<typeof getBackStore>,
    );
    const hybridViewerStoreStub = {
      remoteRender: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    };
    vi.mocked(getHybridViewerStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- simplified mock cast to full store return type, established repo pattern.
      hybridViewerStoreStub as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  test("renders surface creation form with default 3 points", () => {
    const wrapper: VueWrapper = mountWithPlugins(CreatePolygonalSurface);

    expect(wrapper.text()).toContain("Create Surface");
    expect(wrapper.text()).toContain("Pick at least 3 points to create a surface.");
    const pointRows = wrapper.findAll('[data-testid^="point-"]');
    expect(pointRows).toHaveLength(INITIAL_SURFACE_POINTS);
  });

  test("allows adding points and enabling deletion when count exceeds minimum", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreatePolygonalSurface);

    const addButton = wrapper.find('[data-testid="addPointButton"]');
    await addButton.trigger("click");

    const pointRows = wrapper.findAll('[data-testid^="point-"]');
    expect(pointRows).toHaveLength(ADDED_SURFACE_POINTS);

    const removeButtons = wrapper.findAll(".point-row button");
    await removeButtons[FIRST_INDEX]?.trigger("click");

    const remainingRows = wrapper.findAll('[data-testid^="point-"]');
    expect(remainingRows).toHaveLength(INITIAL_SURFACE_POINTS);
  });

  test("executes creation workflow with polygons payload when submitted", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreatePolygonalSurface);

    const p0Inputs = wrapper.find('[data-testid="point-0"]').findAll("input");
    await p0Inputs[0]?.setValue(POINT_ONE_X);
    await p0Inputs[1]?.setValue(POINT_ONE_Y);
    await p0Inputs[2]?.setValue(POINT_ONE_Z);

    const p1Inputs = wrapper.find('[data-testid="point-1"]').findAll("input");
    await p1Inputs[0]?.setValue(POINT_TWO_X);
    await p1Inputs[1]?.setValue(POINT_TWO_Y);
    await p1Inputs[2]?.setValue(POINT_TWO_Z);

    const p2Inputs = wrapper.find('[data-testid="point-2"]').findAll("input");
    await p2Inputs[0]?.setValue(POINT_THREE_X);
    await p2Inputs[1]?.setValue(POINT_THREE_Y);
    await p2Inputs[2]?.setValue(POINT_THREE_Z);

    const submitBtn = wrapper.find('[data-testid="submitButton"]');
    await submitBtn.trigger("click");
    await flushPromises();

    const expectedPoints = [
      { x: NUM_ONE_X, y: NUM_ONE_Y, z: NUM_ONE_Z },
      { x: NUM_TWO_X, y: NUM_TWO_Y, z: NUM_TWO_Z },
      { x: NUM_THREE_X, y: NUM_THREE_Y, z: NUM_THREE_Z },
    ];
    const expectedPolygons = [[0, 1, 2]];

    expect(getBackStore().request).toHaveBeenCalledWith({
      schema: back_schemas.opengeodeweb_back.create.polygonal_surface,
      params: {
        name: "New Surface",
        points: expectedPoints,
        polygons: expectedPolygons,
      },
    });
    expect(importItem).toHaveBeenCalledWith({ id: "surface-id" });
    expect(getHybridViewerStore().remoteRender).toHaveBeenCalledWith();
  });

  test("closes tool when close button is clicked", async () => {
    const uiStore = useUIStore();
    uiStore.setShowCreateTools(true);

    const wrapper: VueWrapper = mountWithPlugins(CreatePolygonalSurface);

    const closeBtn = wrapper.findAll("button").find((btn) => btn.text().includes("Close"));
    await closeBtn?.trigger("click");

    expect(uiStore.showCreateTools).toBe(false);
  });
});
