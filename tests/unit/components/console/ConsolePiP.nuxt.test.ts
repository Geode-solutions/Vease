import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ConsolePiP from "@vease/components/console/ConsolePiP.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useConsoleStore } from "@ogw_front/stores/console";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;

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
function fillConsole(): void {
  const consoleStore = useConsoleStore();
  const done = consoleStore.start_request({
    source: "back",
    kind: "http",
    route: "opengeodeweb_back/upload_file",
  });
  consoleStore.finish_request(done, { status: "success" });
  const failed = consoleStore.start_request({
    source: "viewer",
    kind: "ws",
    route: "opengeodeweb_viewer.mesh.register",
    params: { id: "123" },
  });
  consoleStore.finish_request(failed, { status: "error", error: "Data not found" });
  consoleStore.start_request({
    source: "back",
    kind: "http",
    route: "opengeodeweb_back/save_viewable_file",
  });
}

function rowTexts(wrapper: ReturnType<typeof mountWithPlugins>): string[] {
  return wrapper.findAll("[data-testid='consoleRow']").map((row) => row.text());
}

describe("console pip component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("shows an empty state without entries", () => {
    const wrapper = mountWithPlugins(ConsolePiP);

    expect(wrapper.text()).toContain("Console");
    expect(wrapper.find("[data-testid='consoleEmpty']").exists()).toBe(true);
  });

  test("running requests come first, then the history newest first", () => {
    fillConsole();
    const wrapper = mountWithPlugins(ConsolePiP);

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(3);
    expect(rows[FIRST_INDEX]).toContain("save_viewable_file");
    expect(rows[SECOND_INDEX]).toContain("mesh.register");
    expect(wrapper.text()).toContain("1 running");
  });

  test("the errors filter keeps only the failed requests", async () => {
    fillConsole();
    const wrapper = mountWithPlugins(ConsolePiP);

    await wrapper.find("[data-testid='consoleStatus-errors']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("mesh.register");
  });

  test("a source chip hides its entries", async () => {
    fillConsole();
    const wrapper = mountWithPlugins(ConsolePiP);

    await wrapper.find("[data-testid='consoleSource-back']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("viewer");
  });

  test("a failed row unfolds its params and error", async () => {
    fillConsole();
    const wrapper = mountWithPlugins(ConsolePiP);
    const failedRow = wrapper.find(".console-row--failed");

    await failedRow.trigger("click");

    const detail = wrapper.find(".console-detail");
    expect(detail.text()).toContain('{"id":"123"}');
    expect(detail.text()).toContain("Data not found");
  });

  test("opening the console marks the errors as seen", () => {
    fillConsole();
    const consoleStore = useConsoleStore();
    expect(consoleStore.unseen_errors).toBe(1);

    mountWithPlugins(ConsolePiP);

    expect(consoleStore.unseen_errors).toBe(0);
  });

  test("pause holds the new entries back", async () => {
    fillConsole();
    const consoleStore = useConsoleStore();
    const wrapper = mountWithPlugins(ConsolePiP);

    await wrapper.find("[data-testid='consolePauseButton']").trigger("click");
    consoleStore.log({ source: "back", kind: "http", route: "late_request", status: "success" });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain("late_request");
    expect(wrapper.text()).toContain("1 new");
  });

  test("clear empties the history but keeps running requests", async () => {
    fillConsole();
    const wrapper = mountWithPlugins(ConsolePiP);

    await wrapper.find("[data-testid='consoleClearButton']").trigger("click");

    const rows = rowTexts(wrapper);
    expect(rows).toHaveLength(1);
    expect(rows[FIRST_INDEX]).toContain("save_viewable_file");
  });

  test("closes on close button click", async () => {
    const wrapper = mountWithPlugins(ConsolePiP);
    const uiStore = useUIStore();
    uiStore.setShowConsolePiP(true);

    await wrapper.find("[data-testid='consoleCloseButton']").trigger("click");

    expect(uiStore.showConsolePiP).toBe(false);
  });
});
