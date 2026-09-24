import { VueWrapper, mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
// oxlint-disable-next-line eslint/sort-imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PickButton from "@vease/components/tools/PickButton.vue";

const FIRST_CALL_INDEX = 0;

describe("the PickButton component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders default pick button state when inactive", () => {
    const wrapper: VueWrapper = mount(PickButton, {
      props: { active: false },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("Pick in viewer");
    expect(wrapper.classes()).not.toContain("pick-pulse");
  });

  test("renders active pick button state when active", () => {
    const wrapper: VueWrapper = mount(PickButton, {
      props: { active: true },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("Stop picking");
  });

  test("emits click event when clicked", async () => {
    const wrapper: VueWrapper = mount(PickButton, {
      props: { active: false },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.find('[data-testid="pickButton"]');
    await button.trigger("click");

    const emitted = wrapper.emitted("click");
    expect(emitted).toBeDefined();
    expect(emitted?.[FIRST_CALL_INDEX]).toStrictEqual([]);
  });
});
