/* oxlint-disable sort-imports */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MainNavigation from "@vease/components/Layout/MainNavigation.vue";
import { setupActivePinia, vuetify } from "@vease_tests/utils";

vi.mock(import("@vease/components/Layout/SideBar.vue"), () => ({
  default: {
    name: "SideBar",
    template: "<div data-testid='sidebar-stub'>SideBar</div>",
  },
}));

vi.mock(import("@vease/components/Layout/TopBar.vue"), () => ({
  default: {
    name: "TopBar",
    template: "<div data-testid='topbar-stub'>TopBar</div>",
  },
}));

describe("mainnavigation component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders topbar and sidebar child components", () => {
    const wrapper = mount(MainNavigation, {
      global: { plugins: [vuetify] },
    });

    expect(wrapper.find("[data-testid='topbar-stub']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='sidebar-stub']").exists()).toBe(true);
  });
});
