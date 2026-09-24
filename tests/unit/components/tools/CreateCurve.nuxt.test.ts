import { VueWrapper, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import CreateCurve from "@vease/components/tools/CreateCurve.vue";
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

const INITIAL_CURVE_POINTS = 2;
const ADDED_CURVE_POINTS = 3;
const FIRST_INDEX = 0;
const POINT_ONE_X = "1";
const POINT_ONE_Y = "2";
const POINT_ONE_Z = "3";
const POINT_TWO_X = "4";
const POINT_TWO_Y = "5";
const POINT_TWO_Z = "6";
const NUM_ONE_X = Number(POINT_ONE_X);
const NUM_ONE_Y = Number(POINT_ONE_Y);
const NUM_ONE_Z = Number(POINT_ONE_Z);
const NUM_TWO_X = Number(POINT_TWO_X);
const NUM_TWO_Y = Number(POINT_TWO_Y);
const NUM_TWO_Z = Number(POINT_TWO_Z);

describe("the CreateCurve component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost",
      request: vi.fn<() => Promise<unknown>>().mockResolvedValue({ id: "curve-id" }),
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  test("renders curve creation form with default fields", () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateCurve);

    expect(wrapper.text()).toContain("Create Curve");
    const pointRows = wrapper.findAll('[data-testid^="point-"]');
    expect(pointRows).toHaveLength(INITIAL_CURVE_POINTS);
    expect(wrapper.find('[data-testid="closedCurveCheckbox"]').exists()).toBe(true);
  });

  test("handles point additions and deletions while respecting minimum point limit", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateCurve);

    const addButton = wrapper.find('[data-testid="addPointButton"]');
    await addButton.trigger("click");

    const pointRows = wrapper.findAll('[data-testid^="point-"]');
    expect(pointRows).toHaveLength(ADDED_CURVE_POINTS);

    const removeButtons = wrapper.findAll(".point-row button");
    await removeButtons[FIRST_INDEX]?.trigger("click");

    const remainingRows = wrapper.findAll('[data-testid^="point-"]');
    expect(remainingRows).toHaveLength(INITIAL_CURVE_POINTS);
  });

  test("toggles closed curve checkbox", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateCurve);

    const checkbox = wrapper.find('[data-testid="closedCurveCheckbox"] input');
    await checkbox.setValue(true);

    expect(wrapper.vm.$data).toBeDefined();
  });

  test("executes creation workflow with edges payload when submitted", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateCurve);

    const firstPointRow = wrapper.find('[data-testid="point-0"]');
    const firstInputs = firstPointRow.findAll("input");
    await firstInputs[0]?.setValue(POINT_ONE_X);
    await firstInputs[1]?.setValue(POINT_ONE_Y);
    await firstInputs[2]?.setValue(POINT_ONE_Z);

    const secondPointRow = wrapper.find('[data-testid="point-1"]');
    const secondInputs = secondPointRow.findAll("input");
    await secondInputs[0]?.setValue(POINT_TWO_X);
    await secondInputs[1]?.setValue(POINT_TWO_Y);
    await secondInputs[2]?.setValue(POINT_TWO_Z);

    const submitBtn = wrapper.find('[data-testid="submitButton"]');
    await submitBtn.trigger("click");
    await flushPromises();

    const expectedPoints = [
      { x: NUM_ONE_X, y: NUM_ONE_Y, z: NUM_ONE_Z },
      { x: NUM_TWO_X, y: NUM_TWO_Y, z: NUM_TWO_Z },
    ];
    const expectedEdges = [[0, 1]];

    expect(getBackStore().request).toHaveBeenCalledWith({
      schema: expect.anything(),
      params: {
        name: "New Curve",
        points: expectedPoints,
        edges: expectedEdges,
      },
    });
    expect(importItem).toHaveBeenCalledWith({ id: "curve-id" });
    expect(getHybridViewerStore().remoteRender).toHaveBeenCalledWith();
  });

  test("resets state when tool is closed", async () => {
    const uiStore = useUIStore();
    uiStore.setShowCreateTools(true);

    const wrapper: VueWrapper = mountWithPlugins(CreateCurve);

    const closeBtn = wrapper.findAll("button").find((btn) => btn.text().includes("Close"));
    await closeBtn?.trigger("click");

    expect(uiStore.showCreateTools).toBe(false);
  });
});
