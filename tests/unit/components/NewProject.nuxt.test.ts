import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import NewProject from "@vease/components/NewProject.vue";

vi.setConfig({ testTimeout: 10_000 });

describe("the NewProject component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders dialog content when showDialog is true", () => {
    mountWithPlugins(NewProject, {
      props: { showDialog: true },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("New Project");
    expect(document.body.innerHTML).toContain("Project Name");
    expect(document.body.innerHTML).toContain("Close");
    expect(document.body.innerHTML).toContain("Create");
  });

  test("emits close when Close or Create button is clicked", async () => {
    const wrapper = mountWithPlugins(NewProject, {
      props: { showDialog: true },
      attachTo: document.body,
    });

    const closeButton = document.body.querySelector("button");
    closeButton?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });
});
