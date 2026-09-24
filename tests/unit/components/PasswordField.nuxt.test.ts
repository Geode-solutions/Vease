/* oxlint-disable sort-imports, vitest/require-test-timeout */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import PasswordField from "@vease/components/PasswordField.vue";

const FIELD_LABEL = "Enter your password";
const SAMPLE_PASSWORD = "secret_password_123";

describe("the PasswordField component", () => {
  const toggleVisibilityMock = vi.fn<() => void>();

  beforeEach(() => {
    setupActivePinia();
    toggleVisibilityMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders text field with password type initially", () => {
    const wrapper = mount(PasswordField, {
      props: {
        value: SAMPLE_PASSWORD,
        label: FIELD_LABEL,
        required: true,
        toggleVisibility: toggleVisibilityMock,
      },
      global: { plugins: [vuetify] },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    expect(textField.exists()).toBe(true);
    expect(textField.props("type")).toBe("password");
    expect(textField.props("appendIcon")).toBe("mdi-eye-off");
  });

  test("emits input event when text field receives input", async () => {
    const wrapper = mount(PasswordField, {
      props: {
        value: "",
        label: FIELD_LABEL,
        toggleVisibility: toggleVisibilityMock,
      },
      global: { plugins: [vuetify] },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("input", SAMPLE_PASSWORD);

    expect(wrapper.emitted("input")).toStrictEqual([[SAMPLE_PASSWORD]]);
  });

  test("calls toggleVisibility when append icon is clicked", async () => {
    const wrapper = mount(PasswordField, {
      props: {
        value: SAMPLE_PASSWORD,
        label: FIELD_LABEL,
        toggleVisibility: toggleVisibilityMock,
      },
      global: { plugins: [vuetify] },
    });

    const textField = wrapper.findComponent({ name: "VTextField" });
    await textField.vm.$emit("click:append");

    expect(toggleVisibilityMock).toHaveBeenCalledWith();
  });
});
