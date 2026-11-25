import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ActivityPiP from "@vease/components/activity/ActivityPiP.vue";
import ActivityRow from "@vease/components/activity/ActivityRow.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useActivityStore } from "@ogw_front/stores/activity";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const SCROLLED_DOWN_PX = 200;

vi.mock(import("@vease/components/Layout/ResizablePiP.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of ResizablePiP this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  default: {
    name: "ResizablePiP",
    props: [
      "storageKey",
      "escapeFunction",
      "defaultWidth",
      "defaultHeight",
      "minWidth",
      "minHeight",
    ],
    template: `
      <div class="resizable-pip-stub" :data-storage-key="storageKey">
        <slot name="handle" />
        <slot />
      </div>
    `,
  } as unknown as typeof ResizablePiP,
}));

// One finished back request, one failed viewer request, one back request still running
function fillActivity(): void {
  const activityStore = useActivityStore();
  const done = activityStore.start_request({
    source: "back",
    kind: "http",
    route: "opengeodeweb_back/upload_file",
  });
  activityStore.finish_request(done, { status: "success" });
  const failed = activityStore.start_request({
    source: "viewer",
    kind: "ws",
    route: "opengeodeweb_viewer.mesh.register",
    params: { id: "123" },
  });
  activityStore.finish_request(failed, { status: "error", error: "Data not found" });
  activityStore.start_request({
    source: "back",
    kind: "http",
    route: "opengeodeweb_back/save_viewable_file",
  });
}

function rowTexts(wrapper: ReturnType<typeof mountWithPlugins>): string[] {
  return wrapper.findAll("[data-testid='activityRow']").map((row) => row.text());
}

describe("activity pip component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("shows an empty state without entries", () => {
    const wrapper = mountWithPlugins(ActivityPiP);

    expect(wrapper.text()).toContain("Activity");
    expect(wrapper.find("[data-testid='activityEmpty']").exists()).toBe(true);
  });

  test("running requests come first, then the history newest first", () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(3);
    expect(rows[FIRST_INDEX]).toContain("save_viewable_file");
    expect(rows[SECOND_INDEX]).toContain("mesh.register");
    expect(wrapper.text()).toContain("1 running");
  });

  test("only the running rows follow the clock", () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);

    const nows = wrapper.findAllComponents(ActivityRow).map((row) => row.props("now"));
    expect(nows[FIRST_INDEX]).toBeGreaterThan(0);
    // The history rows get no clock: the prop keeps its default
    expect(nows.slice(SECOND_INDEX)).toStrictEqual([0, 0]);
  });

  test("the errors filter keeps only the failed requests", async () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);

    await wrapper.find("[data-testid='activityStatus-errors']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("mesh.register");
  });

  test("a source chip hides its entries", async () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);

    await wrapper.find("[data-testid='activitySource-back']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("viewer");
  });

  test("a failed row unfolds its params and error", async () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);
    const failedRow = wrapper.find(".activity-row--failed");

    await failedRow.trigger("click");

    const detail = wrapper.find(".activity-detail");
    expect(detail.text()).toContain('{"id":"123"}');
    expect(detail.text()).toContain("Data not found");
  });

  test("opening the activity panel marks the errors as seen", () => {
    fillActivity();
    const activityStore = useActivityStore();
    expect(activityStore.unseen_errors).toBe(1);

    mountWithPlugins(ActivityPiP);

    expect(activityStore.unseen_errors).toBe(0);
  });

  test("at the top, new entries show up live with no back to top button", async () => {
    fillActivity();
    const activityStore = useActivityStore();
    const wrapper = mountWithPlugins(ActivityPiP);

    activityStore.log({ source: "back", kind: "http", route: "late_request", status: "success" });
    await wrapper.vm.$nextTick();

    expect(rowTexts(wrapper)[SECOND_INDEX]).toContain("late_request");
    expect(wrapper.find("[data-testid='activityBackToTop']").exists()).toBe(false);
  });

  test("scrolled down, the back to top button counts the new entries", async () => {
    fillActivity();
    const activityStore = useActivityStore();
    const wrapper = mountWithPlugins(ActivityPiP);
    const list = wrapper.find(".activity-list");

    list.element.scrollTop = SCROLLED_DOWN_PX;
    await list.trigger("scroll");
    expect(wrapper.find("[data-testid='activityBackToTop']").text()).toBe("Back to top");

    activityStore.log({ source: "back", kind: "http", route: "late_request", status: "success" });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[data-testid='activityBackToTop']").text()).toBe("1 new");
  });

  test("back to top goes up and hides the button", async () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);
    const list = wrapper.find(".activity-list");
    list.element.scrollTop = SCROLLED_DOWN_PX;
    await list.trigger("scroll");

    await wrapper.find("[data-testid='activityBackToTop']").trigger("click");

    expect(list.element.scrollTop).toBe(0);
    expect(wrapper.find("[data-testid='activityBackToTop']").exists()).toBe(false);
  });

  test("clear empties the history but keeps running requests", async () => {
    fillActivity();
    const wrapper = mountWithPlugins(ActivityPiP);

    await wrapper.find("[data-testid='activityClearButton']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("save_viewable_file");
  });

  test("closes on close button click", async () => {
    const wrapper = mountWithPlugins(ActivityPiP);
    const uiStore = useUIStore();
    uiStore.setShowActivityPiP(true);

    await wrapper.find("[data-testid='activityCloseButton']").trigger("click");

    expect(uiStore.showActivityPiP).toBe(false);
  });
});
