import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import TextField from "@vease/components/TextField.vue";

vi.setConfig({ testTimeout: 10_000 });

const INPUT_LABEL = "Project Name";
const INITIAL_VALUE = "My Project";
const NEW_VALUE = "Renamed Project";
const MAX_COUNTER = 50;

describe("the TextField component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("renders v-text-field with passed props", () => {
    const wrapper = mountWithPlugins(TextField, {
      props: {
        value: INITIAL_VALUE,
        label: INPUT_LABEL,
        required: true,
        counter: MAX_COUNTER,
      },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    expect(textField.exists()).toBe(true);
    expect(textField.props("label")).toBe(INPUT_LABEL);
    expect(textField.props("counter")).toBe(MAX_COUNTER);
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe(INITIAL_VALUE);
  });

  test("emits input event when text is modified in input field", async () => {
    const wrapper = mountWithPlugins(TextField, {
      props: {
        value: INITIAL_VALUE,
        label: INPUT_LABEL,
      },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("input", NEW_VALUE);

    expect(wrapper.emitted("input")).toStrictEqual([[NEW_VALUE]]);
  });
});
