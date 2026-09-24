import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import MainNavigation from "@vease/components/Layout/MainNavigation.vue";

vi.setConfig({ testTimeout: 10_000 });

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

  test("renders topbar and sidebar child components", () => {
    const wrapper = mountWithPlugins(MainNavigation);

    expect(wrapper.find("[data-testid='topbar-stub']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='sidebar-stub']").exists()).toBe(true);
  });
});
