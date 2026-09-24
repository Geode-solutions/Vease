/* oxlint-disable sort-imports, vitest/require-test-timeout */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import OpenProject from "@vease/components/OpenProject.vue";

describe("the OpenProject component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders open project dialog content when showDialog is true", () => {
    mount(OpenProject, {
      props: { showDialog: true },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Open Project");
    expect(document.body.innerHTML).toContain("Close");
    expect(document.body.innerHTML).toContain("Load");
  });

  test("emits close when action button is clicked", async () => {
    const wrapper = mount(OpenProject, {
      props: { showDialog: true },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const closeBtn = document.body.querySelector("button");
    closeBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });
});
