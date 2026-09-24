/* oxlint-disable sort-imports, vitest/require-test-timeout */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import TextField from "@vease/components/TextField.vue";

const INPUT_LABEL = "Project Name";
const INITIAL_VALUE = "My Project";
const NEW_VALUE = "Renamed Project";
const MAX_COUNTER = 50;

describe("the TextField component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders v-text-field with passed props", () => {
    const wrapper = mount(TextField, {
      props: {
        value: INITIAL_VALUE,
        label: INPUT_LABEL,
        required: true,
        counter: MAX_COUNTER,
      },
      global: { plugins: [vuetify] },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    expect(textField.exists()).toBe(true);
    expect(textField.props("label")).toBe(INPUT_LABEL);
    expect(textField.props("counter")).toBe(MAX_COUNTER);
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe(INITIAL_VALUE);
  });

  test("emits input event when text is modified in input field", async () => {
    const wrapper = mount(TextField, {
      props: {
        value: INITIAL_VALUE,
        label: INPUT_LABEL,
      },
      global: { plugins: [vuetify] },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("input", NEW_VALUE);

    expect(wrapper.emitted("input")).toStrictEqual([[NEW_VALUE]]);
  });
});
