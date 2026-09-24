/* oxlint-disable sort-imports, vitest/require-test-timeout */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import NewProject from "@vease/components/NewProject.vue";

describe("the NewProject component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders dialog content when showDialog is true", () => {
    mount(NewProject, {
      props: { showDialog: true },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("New Project");
    expect(document.body.innerHTML).toContain("Project Name");
    expect(document.body.innerHTML).toContain("Close");
    expect(document.body.innerHTML).toContain("Create");
  });

  test("emits close when Close or Create button is clicked", async () => {
    const wrapper = mount(NewProject, {
      props: { showDialog: true },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const closeButton = document.body.querySelector("button");
    closeButton?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });
});
