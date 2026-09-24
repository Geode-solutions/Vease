import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import PasswordField from "@vease/components/PasswordField.vue";

vi.setConfig({ testTimeout: 10_000 });

const FIELD_LABEL = "Enter your password";
const SAMPLE_PASSWORD = "secret_password_123";

describe("the PasswordField component", () => {
  const toggleVisibilityMock = vi.fn<() => void>();

  beforeEach(() => {
    setupActivePinia();
    toggleVisibilityMock.mockReset();
  });

  test("renders text field with password type initially", () => {
    const wrapper = mountWithPlugins(PasswordField, {
      props: {
        value: SAMPLE_PASSWORD,
        label: FIELD_LABEL,
        required: true,
        toggleVisibility: toggleVisibilityMock,
      },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    expect(textField.exists()).toBe(true);
    expect(textField.props("type")).toBe("password");
    expect(textField.props("appendIcon")).toBe("mdi-eye-off");
  });

  test("emits input event when text field receives input", async () => {
    const wrapper = mountWithPlugins(PasswordField, {
      props: {
        value: "",
        label: FIELD_LABEL,
        toggleVisibility: toggleVisibilityMock,
      },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("input", SAMPLE_PASSWORD);

    expect(wrapper.emitted("input")).toStrictEqual([[SAMPLE_PASSWORD]]);
  });

  test("calls toggleVisibility when append icon is clicked", async () => {
    const wrapper = mountWithPlugins(PasswordField, {
      props: {
        value: SAMPLE_PASSWORD,
        label: FIELD_LABEL,
        toggleVisibility: toggleVisibilityMock,
      },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("click:append");

    expect(toggleVisibilityMock).toHaveBeenCalledWith();
  });
});
