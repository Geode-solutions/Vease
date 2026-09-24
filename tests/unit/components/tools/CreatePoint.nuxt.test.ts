/* eslint-disable eslint/sort-imports */
import { useViewerStore } from "@ogw_front/stores/viewer";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useUIStore } from "@vease/stores/ui";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import CreatePoint from "@vease/components/tools/CreatePoint.vue";

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>().mockResolvedValue("new-item-id"),
}));

const INITIAL_POINT_COUNT = 1;
const ADDED_POINT_COUNT = 2;
const FIRST_INDEX = 0;
const TEST_X = "10";
const TEST_Y = "20";
const TEST_Z = "30";
const NUM_X = Number(TEST_X);
const NUM_Y = Number(TEST_Y);
const NUM_Z = Number(TEST_Z);

describe("the CreatePoint component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(getBackStore).mockReturnValue({
      base_url: "http://localhost",
      request: vi.fn<() => Promise<unknown>>().mockResolvedValue({ id: "point-set-id" }),
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(getHybridViewerStore).mockReturnValue({
      remoteRender: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    vi.spyOn(useViewerStore(), "request").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders point set form with default initial fields", () => {
    const wrapper: VueWrapper = mount(CreatePoint, {
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("Create Point");
    expect(wrapper.find('[data-testid="point-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="point-1"]').exists()).toBe(false);
  });

  test("allows adding and removing point fields", async () => {
    const wrapper: VueWrapper = mount(CreatePoint, {
      global: { plugins: [vuetify] },
    });

    const addButton = wrapper.find('[data-testid="addPointButton"]');
    await addButton.trigger("click");

    expect(wrapper.find('[data-testid="point-1"]').exists()).toBe(true);

    const pointRows = wrapper.findAll('[data-testid^="point-"]');
    expect(pointRows).toHaveLength(ADDED_POINT_COUNT);

    const removeButtons = wrapper.findAll(".point-row button");
    await removeButtons[FIRST_INDEX]?.trigger("click");

    const remainingRows = wrapper.findAll('[data-testid^="point-"]');
    expect(remainingRows).toHaveLength(INITIAL_POINT_COUNT);
  });

  test("enables submit button when valid point coordinates are provided", async () => {
    const wrapper: VueWrapper = mount(CreatePoint, {
      global: { plugins: [vuetify] },
    });

    const submitBtn = wrapper.find('[data-testid="submitButton"]');
    expect(submitBtn.attributes("disabled")).toBeDefined();

    const firstPointRow = wrapper.find('[data-testid="point-0"]');
    const inputs = firstPointRow.findAll("input");

    await inputs[0]?.setValue(TEST_X);
    await inputs[1]?.setValue(TEST_Y);
    await inputs[2]?.setValue(TEST_Z);

    expect(submitBtn.attributes("disabled")).toBeUndefined();
  });

  test("executes creation workflow when submit button is clicked", async () => {
    const wrapper: VueWrapper = mount(CreatePoint, {
      global: { plugins: [vuetify] },
    });

    const firstPointRow = wrapper.find('[data-testid="point-0"]');
    const inputs = firstPointRow.findAll("input");
    await inputs[0]?.setValue(TEST_X);
    await inputs[1]?.setValue(TEST_Y);
    await inputs[2]?.setValue(TEST_Z);

    const submitBtn = wrapper.find('[data-testid="submitButton"]');
    await submitBtn.trigger("click");
    await flushPromises();

    const expectedPoints = [{ x: NUM_X, y: NUM_Y, z: NUM_Z }];
    expect(getBackStore().request).toHaveBeenCalledWith({
      schema: expect.anything(),
      params: {
        name: "New PointSet",
        points: expectedPoints,
      },
    });
    expect(importItem).toHaveBeenCalledWith({ id: "point-set-id" });
    expect(getHybridViewerStore().remoteRender).toHaveBeenCalledWith();
  });

  test("closes tool when close button is clicked", async () => {
    const uiStore = useUIStore();
    uiStore.setShowCreateTools(true);

    const wrapper: VueWrapper = mount(CreatePoint, {
      global: { plugins: [vuetify] },
    });

    const closeBtn = wrapper.findAll("button").find((btn) => btn.text().includes("Close"));
    await closeBtn?.trigger("click");

    expect(uiStore.showCreateTools).toBe(false);
  });
});
