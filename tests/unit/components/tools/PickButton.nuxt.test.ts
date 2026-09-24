import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import PickButton from "@vease/components/tools/PickButton.vue";
import { VueWrapper } from "@vue/test-utils";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_CALL_INDEX = 0;

describe("the PickButton component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders default pick button state when inactive", () => {
    const wrapper: VueWrapper = mountWithPlugins(PickButton, {
      props: { active: false },
    });

    expect(wrapper.text()).toContain("Pick in viewer");
    expect(wrapper.classes()).not.toContain("pick-pulse");
  });

  test("renders active pick button state when active", () => {
    const wrapper: VueWrapper = mountWithPlugins(PickButton, {
      props: { active: true },
    });

    expect(wrapper.text()).toContain("Stop picking");
  });

  test("emits click event when clicked", async () => {
    const wrapper: VueWrapper = mountWithPlugins(PickButton, {
      props: { active: false },
    });

    const button = wrapper.find('[data-testid="pickButton"]');
    await button.trigger("click");

    const emitted = wrapper.emitted("click");
    expect(emitted).toBeDefined();
    expect(emitted?.[FIRST_CALL_INDEX]).toStrictEqual([]);
  });
});
