import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import OpenProject from "@vease/components/OpenProject.vue";

vi.setConfig({ testTimeout: 10_000 });

describe("the OpenProject component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders open project dialog content when showDialog is true", () => {
    mountWithPlugins(OpenProject, {
      props: { showDialog: true },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Open Project");
    expect(document.body.innerHTML).toContain("Close");
    expect(document.body.innerHTML).toContain("Load");
  });

  test("emits close when action button is clicked", async () => {
    const wrapper = mountWithPlugins(OpenProject, {
      props: { showDialog: true },
      attachTo: document.body,
    });

    const closeBtn = document.body.querySelector("button");
    closeBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });
});
